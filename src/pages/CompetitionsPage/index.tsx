import React, { useEffect } from 'react';
import './index.less';
import DefaultLayout from "../../components/layouts/default";
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import DiscordLink from '../../components/DiscordLink';

function CompetitionsPage(props: any) {

  useEffect(() => {

  }, []);
  return (
    <DefaultLayout>
      <div className='CompetitionsPage'>
        <div className='hero'>
          <h1 id='title'>Welcome to ACM AI Competitions <span role="img" aria-label="trophy-emoji">🏆</span></h1>
          <p className='subtext'>Fall Competition starting on October 14th, stay tuned!</p>   
          <div className='button-wrapper'>
            <Link to='register'><Button className='registerbtn'>Register</Button></Link>
          </div>
        </div>
        <div>
          <div className='main-section'>
            <h1 className='statement'>What is this?</h1>
            <p>These are fun competitions (with prizes) where you employ some aspect (or none at all) of AI to compete. We run standard AI programming competitions as well as a new Reinforcement Learning (RL) centric competition using the <a href="https://gym.openai.com/" target="_blank" rel="noopener noreferrer">Open AI Gym</a></p>
            <p>All skill levels are welcome! Our standard AI programming competitions require no machine learning, deep learning, computer vision etc. knowledge to win (our last winner didn't use any of those!). If the RL competition sounds intimidating, fear not! We offer introductory to advanced workshops on RL throughout the competition</p>
            <p>Join our discord to be up to date on updates and events related to our competitions: <DiscordLink /></p>
          </div>
          <div className='main-section'>
            <h1 className='statement'>Current Competitions</h1>
            <p>Check it out! <Link to='/competitions/energium/'>Energium AI</Link></p>
            <p>The next competition will start on October 14th and run for about a week and a half. Stay tuned on our discord for events and follow our ACM at UCSD facebook page for events as well!</p>
            <h1 className='statement'>Past Competitions</h1>
            <p>A list of some of our past competitions!</p>
            <p><Link to={`/competitions/hide-and-seek2020`}>2020 - Hide and Seek</Link></p>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}

export default CompetitionsPage
