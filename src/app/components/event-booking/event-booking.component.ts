import { Component, OnInit, Inject } from '@angular/core';
import { FirebaseDatabaseService } from './../../services/firebase-database.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ActivatedRoute, Router } from '@angular/router';

import * as moment from 'moment';

@Component({
  selector: 'app-event-booking',
  templateUrl: './event-booking.component.html',
  styleUrls: ['./event-booking.component.css']
})
export class EventBookingComponent implements OnInit {

  static Publicity = class {
    poster: any;
    pub_num_posters: any;
    banner: any;
    infodesk: any;
    digboard: any;
    pub_start_date: string;
    pub_acad_blocks: any;
    pub_firstYear_blocks: any
    pub_nonFirstYear_blocks: any;
    pub_messes: any;
    pub_otherColleges: any;
    constructor() { }
  }

  static Monetary = class {
    mon_paid: boolean;
    mon_certi: boolean;
    mon_paid_member: any;
    mon_paid_non_member: any;
    mon_certi_member: any;
    mon_certi_non_member: any;
    mon_expected_expenditure: any;
    constructor() {
      this.mon_paid = false;
      this.mon_certi = false;
    }

  }

  static Event = class {
    isApproved: boolean;
    uid: any;
    external: boolean;
    title: string;
    desc: string;
    start_date: string;
    end_date: string;
    publish_date: string;
    publicity: any;
    monetary: any;
    notes: any;

    constructor() {
      this.uid = JSON.parse(localStorage.getItem('user')).uid;
      this.isApproved = false;
      this.publish_date = moment().format('L');
      this.publicity = new EventBookingComponent.Publicity();
      this.monetary = new EventBookingComponent.Monetary();
    }
  }

  genFG: FormGroup;
  pubFG: FormGroup;
  monFG: FormGroup;
  finalFG: FormGroup;

  animal: string;
  name: string;

  post: any;
  event = new EventBookingComponent.Event();
  qty=23;
  acadBlocks = "AB-1, AB-2, NLH, IC, AB-5";
  firstYearBlocks = "V, VI, XVI, XVII";
  nonFirstYearBlocks = "IX, X, XIV, XV";
  messes = "FC, Annapurna, Apoorva";
  otherColleges = "KMC, SOC, WGSHA";
  today = new Date();

  acadBlock: any;
  firstBlock: any;
  nonFirstBlock: any;
  mess: any;
  otherCollege: any;
  paid: any;
  certified: any;
  sub: any;
  page: any;
  constructor(private fb: FormBuilder,
              private dbService: FirebaseDatabaseService,
              private dialog: MatDialog,
              public snackBar: MatSnackBar,
              private route: ActivatedRoute) {
      
      this.sub = this.route
      .queryParams
      .subscribe(params => {
        // Defaults to 0 if no query param provided.
        console.log(params);
      });
            
    this.genFG = this.fb.group({
      'external': [false,],
      'title': ['', Validators.required],
      'desc': ['', Validators.required],
      'start_date': ['', Validators.required],
      'end_date': ['', Validators.required],
    });
    this.pubFG = this.fb.group({
      'pub_poster': [false,],
      'pub_num_posters': [0,],
      'pub_banner': [false,],
      'pub_infodesk': [false,],
      'pub_digboard': [false,],
      'pub_start_date': ['', Validators.required],
      'pub_acad_blocks': [false,],
      'pub_firstYear_blocks': [false,],
      'pub_nonFirstYear_blocks': [false,],
      'pub_messes': [false,],
      'pub_otherColleges': [false,],
    });
    this.monFG = this.fb.group({
      'mon_paid': [false,],
      'mon_paid_member': [0,],
      'mon_paid_non_member': [0,],
      'mon_certi': [false,],
      'mon_certi_member': [0,],
      'mon_certi_non_member': [0,],
      'mon_expected_expenditure': ['', Validators.required],
    });
    this.finalFG = this.fb.group({
      'notes': ['',],
    })
  }

  generalSubmit(post) {
    this.event.external = post.external || false;
    this.event.title = post.title;
    this.event.desc = post.desc;
    this.event.start_date = moment(post.start_date).format('L');
    this.event.end_date = moment(post.end_date).format('L');
    console.log(this.event);
  }

  publicitySubmit(post) {
    this.event.publicity.poster = post.pub_poster || false;
    this.event.publicity.pub_num_posters = post.pub_num_posters || 0;
    this.event.publicity.banner = post.pub_banner || false;
    this.event.publicity.infodesk = post.pub_infodesk || false;
    this.event.publicity.digboard = post.pub_digboard || false;
    this.event.publicity.pub_acad_blocks = post.pub_acad_blocks || false;
    this.event.publicity.pub_firstYear_blocks = post.pub_firstYear_blocks || false;
    this.event.publicity.pub_nonFirstYear_blocks = post.pub_nonFirstYear_blocks || false;
    this.event.publicity.pub_messes = post.pub_messes || false;
    this.event.publicity.pub_otherColleges = post.pub_otherColleges || false;
    this.event.publicity.pub_start_date = moment(post.pub_start_date).format('L');
    console.log(this.event);
  }

  monetarySubmit(post) {
    this.event.monetary.mon_paid = post.mon_paid || false;
    this.event.monetary.mon_certi = post.mon_certi || false;
    this.event.monetary.mon_paid_member = post.mon_paid_member || 0;
    this.event.monetary.mon_paid_non_member = post.mon_paid_non_member || 0;
    this.event.monetary.mon_certi_member = post.mon_certi_member || 0;
    this.event.monetary.mon_certi_non_member = post.mon_certi_non_member || 0;
    this.event.monetary.mon_expected_expenditure = post.mon_expected_expenditure;
    console.log(this.event);
  }

  allSubmit(a,b,c,d) {
    this.generalSubmit(a);
    this.publicitySubmit(b);
    this.monetarySubmit(c);
    this.event.notes = d.notes;
    console.log(this.event);
    this.openDialog();
  }

  openDialog(): void {
    let dialogRef = this.dialog.open(LoginDialog, {
      maxWidth: '500px',
      data: { title: this.event.title }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        console.log("pushing to DB");
        this.openSnackBar("Event submitted for approval", "Yay!", 2000);
        this.dbService.pushToDB(this.event);
        
      } else {
        this.openSnackBar("Cancelled", "", 1000);
        console.log("not pushing to DB");
      }

    });
  }


  openSnackBar(msg, action, duration) {
    this.snackBar.open(msg, action, {
      duration: duration,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      direction: 'ltr'
      });
    }

  ngOnInit() { }
}


@Component({
  selector: 'login-dialog',
  templateUrl: 'login-dialog.html',
})
export class LoginDialog {

  constructor(
    public dialogRef: MatDialogRef<LoginDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  cancelBut(): void {
    console.log("cancelled");
    this.dialogRef.close();
  }
}