<template>
  <aside
    class="deploy-button"
    :class="{
      'deploy-button--open': open
    }"
  >
    <button class="deploy-button__deploy" @click="setOpen(true)">Deploy</button>
    <div v-if="open" class="deploy-button__popup-container">
      <div v-if="open" class="deploy-button__popup">
        {{ message }}
        <div class="deploy-button__actions">
          <button
            v-if="!actionDone"
            class="deploy-button__accept"
            @click="checkDeploy"
          >
            Accept
          </button>
          <button
            v-if="!actionDone"
            class="deploy-button__cancel"
            @click="setOpen(false)"
          >
            Cancel
          </button>
          <button
            v-if="actionDone"
            class="deploy-button__accept"
            @click="setOpen(false)"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  </aside>
</template>

<script>
import axios from 'axios'
import { GITHUB_TOKEN } from '~/assets/js/config'

export default {
  name: 'DeployButton',
  data() {
    return {
      open: false,
      message: '',
      actionDone: false
    }
  },
  methods: {
    setOpen(value) {
      this.open = value
      this.message =
        'Deploy is going to be performed. Are you sure you want to continue?'
      this.actionDone = false
    },
    async checkDeploy() {
      const config = {
        headers: {
          Authorization: 'Bearer ' + GITHUB_TOKEN
        }
      }
      const { data: developData } = await axios
        .get(
          'https://api.github.com/repos/empathyco/labs-imagine-your-data/commits?sha=develop',
          config
        )
        .catch(() => {
          this.message = 'Error getting Develop commits'
          this.actionDone = true
        })
      const { data: masterData } = await axios
        .get(
          'https://api.github.com/repos/empathyco/labs-imagine-your-data/commits?sha=master',
          config
        )
        .catch(() => {
          this.message = 'Error getting Master commits'
          this.actionDone = true
        })
      const developAndMasterMatch =
        developData[0].commit.url === masterData[0].commit.url
      if (!developAndMasterMatch) {
        await axios
          .post(
            'https://api.github.com/repos/empathyco/labs-imagine-your-data/merges',
            {
              base: 'master',
              head: 'develop',
              commit_message: 'Deployed from dev.imagineyourdata'
            },
            config
          )
          .then(() => {
            this.message = 'Deployment has been initialized'
          })
          .catch((error) => {
            this.message = error
            this.actionDone = true
          })
      } else {
        this.message =
          'No difference has been found between develop and master branches'
      }
      this.actionDone = true
    }
  }
}
</script>

<style scoped lang="scss">
.deploy-button {
  position: fixed;
  z-index: 3;
  padding: 0.9rem 1rem;
  top: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  &--open {
    width: 100%;
    height: 100%;
  }
  button {
    cursor: pointer;
    &:focus {
      outline: none;
    }
  }
  & > button {
    background: $corporative-blue;
    border: none;
    border-radius: 1.25rem;
    padding: 0.5rem 1rem;
    margin: 0.2rem;
    text-transform: uppercase;
    font-size: 1rem;
    font-weight: $font-weight--semibold;
    color: white;
  }
  &__popup {
    background: white;
    border-radius: 1.25rem;
    margin: 0.5rem 0.2rem;
    padding: 1rem 2rem;
    max-width: 500px;
    display: flex;
    flex-direction: column;
    text-align: center;
    &-container {
      position: fixed;
      width: 100%;
      height: 100%;
      top: 0;
      right: 0;
      background: rgba(0, 0, 0, 0.6);
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  &__actions {
    margin-top: 1rem;
    button {
      text-transform: uppercase;
      font-weight: $font-weight--semibold;
      color: white;
      border: none;
      border-radius: 1.25rem;
      margin: 0.2rem;
      padding: 0.5rem 1rem;
    }
  }
  &__accept {
    background: $corporative-blue;
  }
  &__cancel {
    background: $corporative-pink;
  }
}
</style>
