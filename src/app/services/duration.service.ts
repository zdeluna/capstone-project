import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DurationService {

  constructor() { }

  getTotalDays(startDate: Date, duration: string): number {
    let total: number = 0
    switch(duration) {
      case "weekend": total = 2
        break
      case "work-week": total = 5
        break
      case "full-week": total = 7
        break
      case "month": total = (new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0).getDate())
        break
      case "year": total = 365
        break
      default: total = 0
    }
    return total
  }

  getEndDate(startDate: Date, duration: string): Date {
    let endDate: Date = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate())
    switch(duration) {
      case "weekend": endDate.setDate(endDate.getDate() + 2)
        break
      case "work-week": endDate.setDate(endDate.getDate() + 5)
        break
      case "full-week": endDate.setDate(endDate.getDate() + 7)
        break
      case "month": {
        endDate.setMonth(endDate.getMonth() + 1)
        endDate.setDate(endDate.getDate() - 1)
        break
      }
      case "year": {
        endDate.setFullYear(endDate.getFullYear() + 1)
        endDate.setDate(endDate.getDate() - 1)
        break
      }
      default: endDate = startDate
    }
    return endDate
  }

  getCurrentDays(startDate: Date): number {
    let currentDays = new Date().getDate() - startDate.getDate()
    if(currentDays < 0) {
      return 0
    } else {
      return currentDays
    }
  }
}
