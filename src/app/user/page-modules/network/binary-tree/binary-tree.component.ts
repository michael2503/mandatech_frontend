import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/data/services/auth.service';
import { ReferralService } from 'src/app/data/services/user/referral.service';

@Component({
    selector: 'app-binary-tree',
    templateUrl: './binary-tree.component.html',
    styleUrls: ['./binary-tree.component.scss'],
})
export class BinaryTreeComponent implements OnInit {
    form = new FormGroup({
        username: new FormControl('', Validators.required),
    });

    noResult = false;

    get username() {
        return this.form.get('username');
    }

    @ViewChild('treeCont') treeCont: ElementRef;

    searching = false;
    auth;

    userTree = [];

    arrGroup = [];
    superArr = [];

    constructor(
        private authS: AuthService,
        private refS: ReferralService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.getAuth();
        this.getDownlines();
    }

    private getAuth() {
        this.authS.user.subscribe((auth) => {
            this.auth = auth;
        });
    }

    private getDownlines() {
        this.refS.getDownlines().subscribe((res) => {
            this.userTree = res.data;
            this.groupArr(this.auth);
        });
    }

    private groupArr(user, parInd = -1) {
        let groupArr = [];
        groupArr.push([user]);
        let lastArr = groupArr.slice(-1)[0];
        while (this.checkDownlines(lastArr) && groupArr.length < 4) {
            let toAdd = [];
            for (let e of lastArr) {
                if (!e.username) {
                    toAdd = toAdd.concat([{}, {}]);
                    continue;
                }
                let downlines = this.userTree.filter(
                    (u) => e.username == u.placement
                );
                for (let downline of downlines) {
                    let lastPlused = toAdd.slice(-1)[0];
                    if (lastPlused && lastPlused.username) {
                        if (!toAdd.length) {
                            toAdd.push(downline);
                        } else {
                            if (lastPlused.placement == downline.placement) {
                                if (lastPlused.position == 'left') {
                                    toAdd.push(downline);
                                } else {
                                    toAdd.splice(toAdd.length - 1, 0, downline);
                                }
                            } else {
                                toAdd.push(downline);
                            }
                        }
                    } else {
                        toAdd.push(downline);
                    }
                }
                for (let k = 0; k < 2 - downlines.length; k++) {
                    let lastPlused = toAdd[toAdd.length - 1];
                    if (lastPlused && lastPlused.position) {
                        if (lastPlused.position == 'left') {
                            toAdd.push({
                                placement: e.username,
                                position: 'right',
                            });
                        } else if (downlines.length) {
                            toAdd.splice(toAdd.length - 1, 0, {
                                placement: e.username,
                                position: 'left',
                            });
                        } else {
                            toAdd.push({
                                placement: e.username,
                                position: `${
                                    toAdd.length % 2 == 0 ? 'left' : 'right'
                                }`,
                            });
                        }
                    } else {
                        toAdd.push({
                            placement: e.username,
                            position: `${
                                toAdd.length % 2 == 0 ? 'left' : 'right'
                            }`,
                        });
                    }
                }
            }
            groupArr.push(toAdd);
            lastArr = groupArr.slice(-1)[0];
        }
        this.superArr.push({
            username: user.username,
            downlines: groupArr,
            parInd: parInd,
        });
        this.noResult = false;
        setTimeout(() => {
            this.setMouseHover();
        });
    }

    private setMouseHover() {
        const imgConts = this.treeCont.nativeElement.querySelectorAll(
            '.eachUserInfoInner > .imgCont'
        );
        imgConts.forEach((imgCont) => {
            imgCont.onmouseover = (e) => {
                this.imgHover(e, imgCont);
            };
        });
    }

    checkDownlines(arr) {
        for (let i = 0; i < arr.length; i++) {
            if (!arr[i].username) continue;
            let downline = this.userTree.find(
                (u) => arr[i].username == u.placement
            );
            if (downline || arr[i].username) {
                return true;
            }
        }
        return false;
    }

    trackPage(i, item) {
        return JSON.stringify(item);
    }
    trackLevel(i, item) {
        return JSON.stringify(item);
    }
    trackUser(i, item) {
        return JSON.stringify(item);
    }

    imgHover = (e, imgCont) => {
        if (e.target != imgCont.children[0]) return;
        let curYPos = e.y;
        let fullDetH = +getComputedStyle(imgCont.children[1]).height.replace(
            'px',
            ''
        );
        if (curYPos - e.offsetY >= fullDetH) {
            imgCont.children[1].classList.add('dispTop');
        } else {
            imgCont.children[1].classList.remove('dispTop');
        }
    };

    checkUserExistDownlines(user) {
        let singleLastUsers = this.superArr
            .slice(-1)[0]
            .downlines.reduce((a, b) => a.concat(b));
        console.log(singleLastUsers);
        return singleLastUsers.find((s) => s.username == user.username);
    }

    calcHW(j) {
        let neutInd = j < 4 ? j : j + 1;
        let diff = +(neutInd - 4).toString().replace('-', '');
        return (diff - 1) * 12.5 + 6.25;
    }

    moreDownlines(user, j) {
        let userExist = this.checkUserExistDownlines(user);
        while (!userExist) {
            this.superArr.pop();
            userExist = this.checkUserExistDownlines(user);
        }
        this.groupArr(user, j);
    }

    removeDownlines(user) {
        let lastUser = this.superArr.slice(-1)[0];
        while (lastUser.username != user.username) {
            this.superArr.pop();
            lastUser = this.superArr.slice(-1)[0];
        }
        this.superArr.pop();
    }

    trackInp() {
        if (!this.username.value) {
            this.superArr = [];
            this.groupArr(this.auth);
        }
    }

    search() {
        if (this.form.invalid) return;
        let userExist = this.userTree.find(
            (u) => u.username.toLowerCase() == this.username.value.toLowerCase()
        );
        if (userExist) {
            this.superArr = [];
            this.groupArr(userExist);
            return;
        }
        this.noResult = true;
    }

    addUser(user) {
        this.router.navigate(['/user/business/register'], {
            queryParams: { placement: user.placement },
        });
    }
}
