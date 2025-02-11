import moment from 'moment';

class CustomDate {
  isValidTokenTime(date: string | null): boolean {
    return !date ? false : moment().isBefore(moment(date));
  }
  getDate(interval: string) {
    const date = { startDate: '', endDate: '' };
    switch (interval) {
      case 'mes':
        date.startDate = moment().startOf('month').format('YYYY-MM-DDTHH:mm:ss');
        date.endDate = moment().endOf('month').format('YYYY-MM-DDTHH:mm:ss');
        break;
      case 'dia':
        date.startDate = moment().startOf('day').format('YYYY-MM-DDTHH:mm:ss');
        date.endDate = moment().endOf('day').format('YYYY-MM-DDTHH:mm:ss');
        break;
      case 'ano':
        date.startDate = moment().startOf('year').format('YYYY-MM-DDTHH:mm:ss');
        date.endDate = moment().endOf('year').format('YYYY-MM-DDTHH:mm:ss');
        break;
      case 'trimestre':
        date.startDate = moment().startOf('quarter').format('YYYY-MM-DDTHH:mm:ss');
        date.endDate = moment().endOf('quarter').format('YYYY-MM-DDTHH:mm:ss');
        break;
      case 'projectStart':
        date.startDate = moment('2020-01-01').startOf('year').format('YYYY-MM-DDTHH:mm:ss');
        date.endDate = moment().endOf('year').format('YYYY-MM-DDTHH:mm:ss');
        break;
      default:
        console.log('Formato de data não encontrado');
    }

    return date;
  }
}

export default new CustomDate();
