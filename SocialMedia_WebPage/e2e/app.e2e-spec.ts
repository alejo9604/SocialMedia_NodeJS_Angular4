import { WsPage } from './app.po';

describe('ws App', () => {
  let page: WsPage;

  beforeEach(() => {
    page = new WsPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
