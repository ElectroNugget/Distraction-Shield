import React from 'react';
import { Progress, message, Icon, Row, Col, Button, Empty } from 'antd'; //Ant Design, 'worlds second most popular react UI'.
import { getFromStorage, setInStorage, setInFirebase } from '../util/storage';
import {
    defaultExerciseSite,
    defaultExerciseSites,
    defaultexerciseDuration,
    defaultTimeout
} from '../util/constants';
import { parseUrl, setTimeout } from '../util/block-site';
import { duration } from 'moment';
import './Intercepted.css';

function Intercepted(props) {
    // state = {
    //   currentExerciseSite: '',
    //   timeLeft: 0,
    //   timestamp: new Date().getTime(),
    //   timer: null,
    //   exerciseSites: [],
    //   exerciseDuration: 0,
    //   timeWastedDuration: 0,
    //   timeSpentLearningTemp: {},
    //   closeSuccess: false,
    //   skipTimeLeft: 4000,
    //   skipped: false,
    //   countedTime: 0,
    //   countTimer: null
    // }
    
    const [currentExerciseSite,setExerciseSite] = useState('');
    const [timeLeft, setTimeLeft] = useState(0);
    const [timeStamp, setTimeStamp] = useState(new Date().getTime());
    const [timer, setTimer] = useState(null);
    const [exerciseSites, setExerciseSites] = useState([]);
    const [exerciseDuration, setExerciseDuration] = useState(0);
    const [timeWastedDuration, setTimeWastedDuration] = useState(0);
    const [timeSpentLearningTemp, setTimeSpentLearningTemp] = useState({});
    const [closeSuccess, setCloseSuccess] = useState(false);
    const [skipTimeLeft, setSkipTimeLeft] = useState(4000);
    const [skipped, setSkipped] = useState(false);
    const [countedTime, setCountedTime] = useState(0);
    const [countTimer, setCountTimer] = useState(null);

    const componentDidMount = () => {
        message.open({
            content: "Let's do some learning before having fun!",
            icon: <Icon type="smile" />
        });

        setup();

        let timer = setInterval(() => {
            let timestamp = new Date().getTime();
            let timePassed = timestamp - state.timestamp;

            if (!document.hasFocus()) timePassed = 0;

            let skipTimeLeft = state.skipTimeLeft - timePassed;

            let timeLeft = state.timeLeft - timePassed;

            if (timeLeft <= 0) clearInterval(state.timer)

            // update time spent learning on website
            getFromStorage('timeSpentLearning').then(res => {
                let timeSpentLearning = res.timeSpentLearning || {};
                let site = getExerciseSite();

                if (!site) return; // not found, do not update.

                let newExerciseTimeSpent = timeSpentLearning[site.name]
                                                + timePassed || timePassed;
                timeSpentLearning[site.name] = newExerciseTimeSpent;

                setState({timeSpentLearningTemp: timeSpentLearning});
                
                return setInStorage({ timeSpentLearning });
            }); 

            setState({ timeLeft, timestamp, skipTimeLeft });
        }, 1000);

        let countTimer = setInterval(() => {
            if(document.hasFocus() && state.timeLeft <= 0){
                let countedTime = state.countedTime + 1000;
                setState({ countedTime });
            }
        }, 1000);
        
        setState({ timer, countTimer });
    }

    const setup = () => {
        getFromStorage('intercepts', 'currentExerciseSite',
                        'exerciseSites', 'exerciseDuration', 'timeWastedDuration').then(res => {
            let currentExerciseSite = res.currentExerciseSite || 
                defaultExerciseSite.name; // @FIXME dont assume.
            let exerciseSites = res.exerciseSites || defaultExerciseSites;
            let exerciseDuration = res.exerciseDuration || defaultexerciseDuration
            let timeLeft = exerciseDuration; // set initial time
            let timeWastedDuration = res.timeWastedDuration || defaultTimeout;

            setState({ currentExerciseSite, exerciseSites,
                            exerciseDuration, timeLeft, timeWastedDuration });

            let intercepts = res.intercepts || {};
            let parsed = parseUrl(getUrl());

            if (!parsed) return; // no url search param
            
            let count = intercepts[parsed.hostname] + 1 || 1;
            intercepts[parsed.hostname] = count;

            setInFirebase({ intercepts });
            return setInStorage({ intercepts });
        });
        
        window.addEventListener('beforeunload', (event) => {
            event.preventDefault();

            if(state.timeLeft <= 0){
                getFromStorage('timeSpentLearning').then(res => {
                    let timeSpentLearning = res.timeSpentLearning || {};
                    let site = getExerciseSite();
    
                    if (!site) return; // not found, do not update.
    
                    let newExerciseTimeSpent = timeSpentLearning[site.name]
                                                    + state.countedTime || state.countedTime;
                    timeSpentLearning[site.name] = newExerciseTimeSpent;
    
                    setState({timeSpentLearningTemp: timeSpentLearning});
                    
                    return setInStorage({ timeSpentLearning });
                });
                if(!state.closeSuccess){
                    onContinue();
                }
            }
                        
            return setInFirebase(state.timeSpentLearningTemp); 
        });
    }

    const getUrl = () => {
        let params = (new URL(window.location)).searchParams; // since chrome 51, no IE
        return params.has('url') ? params.get('url') : '';
    }

    const getExerciseSite = () => {
        return state.exerciseSites.find(site => {
            return site.name === state.currentExerciseSite;
        });
    }

    const onContinue = () => {
        timeout();
        setInFirebase('Success');
        setState({closeSuccess: true});
    }

    const onSkip = () => {
        timeout();
        setInFirebase('Skipped');
    }

    const timeout = () => {
        let url = parseUrl(getUrl());
        let now = new Date().valueOf();

        setTimeout(url, now + state.timeWastedDuration).then(() => {
            window.location.href = url.href;
        });
    }

        let url = parseUrl(getUrl());
        let name = url && url.name
        let site = getExerciseSite();
        let progressPercentage = 100 - Math.round(
            (
                // convert to seconds first.
                Math.round(state.timeLeft / 1000)
                / 
                Math.round(state.exerciseDuration / 1000)
            ) * 100
        );

        // time left string
        let padZero = unit => unit <= 0 ? `00` : (unit < 10 ? `0${unit}` : `${unit}`);
        let timeLeftMoment = duration(state.timeLeft);
        let timeLeftString = `${padZero(timeLeftMoment.minutes())}:` +
                                `${padZero(timeLeftMoment.seconds())}`;

        return (
            <div>
                {site ? (
                    <iframe title="Interception page" 
                        width="100%"
                        src={site ? site.href : ''}
                        className="full-screen-iframe"
                        >
                    </iframe>
                ) : (
                    <Empty description="No exercise website"
                        style={{ height: '89vh', paddingTop: '30vh' }} />
                )}
                <div className="status-footer">
                    <Row className="status-bar">
                        <Progress 
                            percent={progressPercentage}
                            size="small"
                            showInfo={false}
                            strokeWidth={5}
                            />
                    </Row>
                    <Row
                        className="status-overlay">
                        <Col span={14} offset={4}>
                            {state.timeLeft > 0 &&
                            <div>Time left: &nbsp;
                                <small>
                                    <code>{timeLeftString}</code>
                                </small>
                            </div>
                            }

                            {state.timeLeft <= 0 &&
                                <div>Well done! You earned&nbsp;
                                {duration(state.timeWastedDuration).humanize()}
                                &nbsp;of browsing time.</div>
                            }
                        </Col>
                        <Col span={6}>
                            <Button className="success-button"
                                type="primary" 
                                icon="login"
                                disabled={state.timeLeft > 0}
                                loading={state.timeLeft > 0}
                                onClick={() => onContinue()}
                                >
                                Continue to  { name } 
                            </Button>
                        <Col className="between-buttons">
                            <Button className="skip-button"
                                type="dashed"
                                size="small"
                                disabled={state.skipTimeLeft > 0}
                                onClick={() => onSkip()}
                                >
                                Emergency skip to { name } 
                            </Button>
                        </Col>
                        </Col>
                    </Row>
                </div>                
            </div>
        );
    
}

export default Intercepted;