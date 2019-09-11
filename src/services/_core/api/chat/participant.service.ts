import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Participant } from '@gw-models/core';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class ParticipantService {

  constructor(private http: HttpClient) {
  }

  /**
   *
   * @param url - url that will be used to add participant
   * @param participant - participant that will be added
   */
  public addParticipant(url: string, participant: Participant) {
    return this.http.post<Participant>(url, participant, httpOptions);
  }

  /**
   *
   * @param url - url that will be used to get selected participant
   */
  public getParticipant(url: string): Observable<Participant> {
    return this.http.get<Participant>(url, httpOptions);
  }
}
