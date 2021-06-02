import { AppPage } from './app.po';

describe('angluar-cli-playground App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display svg', () => {
    page.navigateTo();
    expect(page.getChartSvg().getTagName()).toEqual('svg');
  });
});
