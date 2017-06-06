import * as storage from '../storage/storage'
import * as constants from '../../constants'
import * as stringutil from '../stringutil'
import BlockedSiteList from '../../classes/BlockedSiteList'

/**
 * This method goes through the interceptDateList and count how many times the user was intercepted last day,
 * last week, last month and the total amount of interceptions.
 * @param {List} dateList the total list with all interceptions on the different days
 */
export function calcInterceptData(dateList) {
    let tmp = dateList;
    let countDay = 0, countWeek = 0, countMonth = 0, countTotal = 0;

    if (tmp !== null) {
        let firstDate = new Date();
        let length = tmp.length;
        for (let i = 0; i < length; i++) {
            let secondDate = new Date(tmp.pop());
            let diffDays = Math.floor(Math.abs((firstDate.getTime() - secondDate.getTime()) / (constants.oneDay)));
            if (diffDays === 0) {
                countDay++;
            }
            if (diffDays <= 7) {
                countWeek++;
            }
            if (diffDays <= 31) {
                countMonth++
            }
            countTotal++;
        }
    }
    return {
        countDay: countDay,
        countWeek: countWeek,
        countMonth: countMonth,
        countTotal: countTotal
    }
}

/**
 * Receives the url from the parameter, and searches the correct blockedSite item from the blockedsite list.
 * Then the interceptioncounter for this item is incremented by 1.
 * Also the global interceptioncounter is incremented by one.
 * @param {string} urlAddress the url to be compared with the blockedsite list to find the correct item to be incremented
 */
export function incrementInterceptionCounter(urlAddress) {
    let blockedSites = new BlockedSiteList();
    storage.getBlacklistPromise().then((result) => {
        blockedSites.addAllToList(result);

        let urlList = blockedSites.list;
        for (let i = 0; i < urlList.length; i++) {
            if (stringutil.wildcardStrComp(urlAddress, urlList[i].url)) {
                urlList[i].counter = urlList[i].counter + 1;
                break;
            }
        }

        storage.setBlacklist(blockedSites);
        storage.getInterceptCounter()
            .then(function (output) {
                let counter = output.tds_interceptCounter;
                counter++;
                storage.setInterceptCounter(counter);
            });
    });


}

/**
 * Adds the current time+date to the saved time+date list
 */
export function addToInterceptDateList() {
    let interceptDateList;
    storage.getInterceptDateList()
        .then(function (result) {
            interceptDateList = result.tds_interceptDateList;
        })
        .then(function () {
            let newDate = new Date().toDateString();
            if (interceptDateList === null) {
                interceptDateList = [newDate];
            } else {
                interceptDateList.push(newDate);
            }
        })
        .then(function () {
            storage.setInterceptDateList(interceptDateList);
        });
}

