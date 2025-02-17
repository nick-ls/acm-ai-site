import React, { useEffect, useState } from 'react';
import './index.less';
import DefaultLayout from '../../components/layouts/default';
import {
  ACMEvent,
  fetchPastEvents,
  fetchFutureEvents,
} from '../../actions/events';
import { Row, Col, Layout, Tabs } from 'antd';
import EventCard from '../../components/EventCard/index';
import MainFooter from '../../components/MainFooter';
const { Content } = Layout;

const newEvents = (eventData: ACMEvent[]): React.ReactNode => {
  return (
    <Content className="eventsList">
      {eventData.length === 0 && (
        <div>
          <h3>There are no upcoming events at this time. Check back later!</h3>
        </div>
      )}

      <div>
        {eventData.map((event) => (
          <EventCard event={event} key={event.uuid} />
        ))}
      </div>
    </Content>
  );
};

const pastEvents = (eventData: ACMEvent[]): React.ReactNode => {
  return (
    <Content className="eventsList">
      <div>
        {eventData.map((event) => (
          <EventCard event={event} key={event.uuid} />
        ))}
      </div>
    </Content>
  );
};

function EventsPage(props: any) {
  const [futureEventData, setFutureEventData] = useState<Array<ACMEvent>>([]);
  const [pastEventData, setPastEventData] = useState<Array<ACMEvent>>([]);

  useEffect(() => {
    fetchFutureEvents().then((data) => {
      setFutureEventData(data);
    });
    fetchPastEvents().then((data) => {
      setPastEventData(data);
    });
  }, []);

  return (
    <DefaultLayout>
      <Content className="EventsPage">
        <Content className="eventsHeader">
          <h1 className="title2">ACM AI Events</h1>
          <h4>
            ACM AI offers a breadth of socials and workshops to help keep our
            members engaged. We try our best to make them as fun and exciting
            for everyone!
          </h4>
        </Content>

        <Content className="eventsContent">
          <Tabs
            size="small"
            animated={true}
            tabPosition="top"
            items={[
              {
                label: <p>Upcoming Events</p>,
                key: '1',
                children: newEvents(futureEventData),
              },
              {
                label: <p>Past Events</p>,
                key: '2',
                children: pastEvents(pastEventData),
              },
            ]}
          ></Tabs>
        </Content>
            
        <Content className="eventsFAQ">
          <Row className="splitInfoRow"> 
            <Col className="infoText">
              <h3> What events does <span className="colorful">ACM AI</span> run?</h3>
              <p>
              We run all kinds of events, from intro to deep learning workshops to fun socials or
              seminars from distinguished researchers and professors. 
              Events are a great way to engage with the AI community at UCSD and learn content 
              you may not typically learn in class. 

              Join the conversation on Discord to learn more!
              </p>
            </Col>
          </Row>
          <Row className="splitInfoRow">
            <Col className="infoText">
              <h3>Where can I find past events</h3>
              <p>
              We post all of our workshop recordings on our YouTube at {' '}
              <a href="https://acmurl.com/youtube" target="_blank" rel="noopener noreferrer">
                https://acmurl.com/youtube
              </a>.
              Stay tuned in our Discord for uploads!
              </p>
            </Col>
          </Row>
        </Content>
      </Content>

      <MainFooter />
    </DefaultLayout>
  );
}

export default EventsPage;
