import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SortService {

  constructor() { }

  sortByActivityTotal(entries) {
    var len = entries.length;
    for (var i = 0; i < len - 1; i = i + 1) {
      var j_min = i;
      for (var j = i + 1; j < len; j = j + 1) {
        if (entries[j].activityTotal > entries[j_min].activityTotal) {
          j_min = j;
        } else {}
      }
      if (j_min !== i) {
        this.swap(entries, i, j_min);
      } else {}
    }
    return entries
  }

  swap(A, x, y) {
    var temp = A[x];
    A[x] = A[y];
    A[y] = temp;
  }
}
