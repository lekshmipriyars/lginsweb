import { ActivityModule } from './activity.module.ts';

describe('ActivityModule', () => {
  let activityModule: ActivityModule;

  beforeEach(() => {
    activityModule = new ActivityModule();
  });

  it('should create an instance', () => {
    expect(activityModule).toBeTruthy();
  });
});
