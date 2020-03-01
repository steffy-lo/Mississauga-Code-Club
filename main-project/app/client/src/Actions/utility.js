import { getState } from 'statezero';

export function getUserTypeExplicit() {
  let type = "";
  switch(getState('uType')) {
    case 1:
      type = "administrator";
      break
    case 2:
      type = "teacher";
      break;
    case 3:
      type = "volunteer";
      break;
    case 4:
      type = "student";
    default:
      //type = "error";

      //type = "student";
      type = "administrator";
      //type = "teacher";
      //type = "volunteer";
    }
    return type;
}
