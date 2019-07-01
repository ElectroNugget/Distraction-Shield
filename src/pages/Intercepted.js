import React from 'react';
import { Progress, message, Icon, Row, Col, Button } from 'antd';
import { getFromStorage, setInStorage } from '../util/storage';
import { exerciseSites, exerciseTime } from '../util/constants';
import { parseUrls } from '../util/block-site';
import { duration } from 'moment';

class Intercepted extends React.Component {
    state = {
      currentExerciseSite: '',
      timeLeft: exerciseTime, // 5 minutes in miliseconds
      timestamp: new Date().getTime(),
      timer: null
    }

    componentDidMount() {
        message.open({
            content: 'You were intercepted!',
            icon: <Icon type="stop" />
        });

        getFromStorage('intercepts').then(res => {
            let intercepts = res.intercepts || {};
            let parsed = this.getParsedUrl();
            let count = intercepts[parsed.hostname] + 1 || 1;
            intercepts[parsed.hostname] = count;
            return setInStorage({ intercepts });
        });

        getFromStorage('currentExerciseSite').then(res => {
            let { currentExerciseSite } = res;
            this.setState({ currentExerciseSite });
        });

        let timer = setInterval(() => {
            let timestamp = new Date().getTime();
            let timePassed = timestamp - this.state.timestamp;
            let timeLeft = this.state.timeLeft - timePassed;
            
            if (timeLeft <= 0) clearInterval(this.state.timer)

            // update time spent learning on website
            getFromStorage('timeSpentLearning').then(res => {
                let timeSpentLearning = res.timeSpentLearning || {};
                let site = this.getExerciseSite();
                let newExerciseTimeSpent = timeSpentLearning[site.name] + timePassed
                                            || timePassed;
                timeSpentLearning[site.name] = newExerciseTimeSpent;
                return setInStorage({ timeSpentLearning });
            });

            this.setState({ timeLeft, timestamp });
        }, 1000);
        this.setState({ timer });
    }

    getParsedUrl() {
        return parseUrls(this.getUrl())[0];
    }

    getUrl() {
        let params = (new URL(window.location)).searchParams; // since chrome 51, no IE
        let url = params.get('url');
        return url;
    }

    getExerciseSite() {
        return exerciseSites.find(site => {
            return site.name === this.state.currentExerciseSite;
        });
    }

    render() {
        let url = this.getParsedUrl();
        let site = this.getExerciseSite();
        let progressPercentage = 100 - Math.round(
            (
                // convert to seconds first.
                Math.round(this.state.timeLeft / 1000)
                / 
                Math.round(exerciseTime / 1000)
            ) * 100
        );

        // time left string
        let padZero = unit => unit <= 0 ? `00` : (unit < 10 ? `0${unit}` : `${unit}`);
        let timeLeftMoment = duration(this.state.timeLeft);
        let timeLeftString = `${padZero(timeLeftMoment.minutes())}:` +
                                `${padZero(timeLeftMoment.seconds())}`;

        return (
            <div>
                <iframe title="Interception page" 
                    width="100%"
                    src={site ? site.url : 'https://www.babbel.com/'}
                    style={{ height: '90vh'}}>
                </iframe>
                <div style={{ height: '9vh' }}>
                    <Row type="flex" justify="space-around" align="middle">
                        <Col md={8}>
                            <h3>Time left:</h3>
                            <code>{timeLeftString}</code>
                            <Progress percent={progressPercentage} />
                            {this.state.timeLeft <= 0 &&
                                <div>Well done! You earned &nbsp;
                                {duration(exerciseTime).humanize()}
                                &nbsp;of browsing time.</div>
                            }
                        </Col>
                        <Col md={2}>
                            <a href={url.href} style={{ margin: '5px' }}>
                                <Button icon="login" disabled={this.state.timeLeft > 0}>
                                    Continue to {url.hostname}
                                </Button>
                            </a>
                        </Col>
                    </Row>
                </div>
                
            </div>
        );
    }
}
export default Intercepted;