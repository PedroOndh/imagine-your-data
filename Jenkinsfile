TESTS = false
BUCKETS = [ prod: 'imagineyourdata.com', dev: 'dev.imagineyourdata.com' ]
CLOUDFRONT_ID = [ dev: 'E37P3T68OB7LDJ', prod: 'E3QN6XMRWM5FIL']
CACHE = [   prod: 'max-age=3600',
            dev:    'no-store' ]

pipeline {
    agent {
        label 'docker'
    }
    environment { SONAR_HOST_URL = 'https://sonarqube.internal.shared.empathy.co' }
    options {
        ansiColor('xterm')
        buildDiscarder(logRotator(numToKeepStr:'30', artifactNumToKeepStr:'10'))
    }
    stages {
        stage('Building & Testing') {
            agent {
                docker {
                    image 'node:10'
                    reuseNode true
                }
            }
            stages {
                stage('Installing Dependencies') {
                    steps {
                        npmCI()
                    }
                }
                stage('CMS OAuth GitHub') {
                    steps {
                        sh "sed -i -e 's;(base_url);https://00hxmoid48.execute-api.eu-west-1.amazonaws.com;g' static/admin/config.yml"
                        withCredentials([usernamePassword(credentialsId: 'github-access', passwordVariable: 'password', usernameVariable: 'username')]) {
                            sh "sed -i -e 's;(github_token);${password};g' assets/js/config.js"
                        }
                    }
                }
                stage('Running tests') {
                    when {
                        expression { TESTS }
                    }
                    steps {
                        sh 'npm run test'
                    }
                }
                stage('Build') {
                    steps {
                        sh 'npm run generate'
                    }
                }
            }
            post {
                always {
                    jiraSendBuildInfo site: 'searchbroker.atlassian.net'
                }
            }
        }

        stage('Code Quality') {
            agent {
                docker {
                    image 'node:10'
                    reuseNode true
                }
            }
            steps {
                //dependencyCheckWrapper projectType: 'npm', projectName: packageJson.name, projectVersion:packageJson.version
                withSonarQubeEnv('SonarQube') {
                    sonarQubeReport(type: 'npm', isPR: (env.CHANGE_ID != null))
                }
            }
        }

        stage('Quality Gate') {
            when { changeRequest() }
            steps {
                timeout(time: 10, unit: 'MINUTES') {
                    catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                        waitForQualityGate(abortPipeline: true)
                    }
                }
            }
        }

        stage('Deploying') {
            parallel {
                stage('Dev') {
                    when { 
                        expression { BUCKETS.containsKey('dev')}
                        expression { branch 'develop' }
                    }
                    steps {
                        deployWebsite('dev')
                    }
                }
                stage('Prod') {
                    when { branch 'master' }
                    steps {
                        deployWebsite('prod')
                    }
                }
            }
        }
    }
    post {
        always {
            cleanWs()
        }
    }
}

def deployWebsite(String environment) {
    withAWS(role: 'Jenkins', roleAccount: globalVariables.AWSAccountIDs('websites')) {
        sh "aws s3 cp dist/index.html s3://${BUCKETS[environment]} --acl public-read --cache-control no-store"
        sh "aws s3 sync dist s3://${BUCKETS[environment]} --acl public-read --sse AES256 --delete --cache-control ${CACHE[environment]} --exclude datavis"
        cfInvalidate(distribution: CLOUDFRONT_ID[environment], paths:["/*"])
    }
    jiraSendDeploymentInfo environmentId: environment, environmentName: environment, environmentType: environment, site: 'searchbroker.atlassian.net'
}
