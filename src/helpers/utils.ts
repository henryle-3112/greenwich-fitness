/**
 * Utils class for common function
 */
export class Utils {
  // get current date
  public static getCurrentDate(): string {
    const today = new Date();
    const dd = today.getDate();
    const mm = today.getMonth() + 1;
    const yyyy = today.getFullYear();
    let ddStr, mmStr;
    if (dd < 10) {
      ddStr = '0' + dd;
    } else {
      ddStr = dd;
    }
    if (mm < 10) {
      mmStr = '0' + mm;
    } else {
      mmStr = mm;
    }
    return mmStr + '/' + ddStr + '/' + yyyy;
  }
}
