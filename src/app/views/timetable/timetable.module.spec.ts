import { TimetableModule } from './timetable.module.ts';

describe('TimetableModule', () => {
  let timetableModule: TimetableModule;

  beforeEach(() => {
    timetableModule = new TimetableModule();
  });

  it('should create an instance', () => {
    expect(timetableModule).toBeTruthy();
  });
});
