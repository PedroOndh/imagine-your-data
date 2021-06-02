import { browser, by, element } from 'protractor';

export class AppPage {
  navigateTo() {
    return browser.get('/');
  }

  getChartSvg() {
    return element(by.css('#chart'));
  }
}
