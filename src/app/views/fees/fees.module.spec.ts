import { FeesModule } from './fees.module.ts';

describe('FeesModule', () => {
  let feesModule: FeesModule;

  beforeEach(() => {
    feesModule = new FeesModule();
  });

  it('should create an instance', () => {
    expect(feesModule).toBeTruthy();
  });
});
