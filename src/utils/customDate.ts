import moment from 'moment';

class CustomDate {
  isValidTokenTime(date: string | null): boolean {
    return !date ? false : moment().isBefore(moment(date));
  }
}

export default new CustomDate();
