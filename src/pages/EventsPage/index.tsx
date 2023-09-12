import React, { useEffect, useState } from 'react';
import './index.less';
import DefaultLayout from '../../components/layouts/default';
import { ACMEvent, fetchPastEvents } from '../../actions/events';
import { Row, Col, Layout, Tabs } from 'antd';
import EventCard from '../../components/EventCard/index';
const { Content, Footer } = Layout;




const newEvents = ({ eventData }: { eventData: ACMEvent[] }): React.ReactNode => {
  return (
    <Content className="eventsList">

      {eventData.length == 0 && (
        <div><h3>There are no upcoming events at this time. Check back later!</h3></div>
      )}

       <div>
        {eventData.map(event => (
          <EventCard event={event} key={event.uuid} />
        ))}
      </div> 

    </Content>
  );
}

const pastEvents = ({ eventData }: { eventData: ACMEvent[] }): React.ReactNode => {
  return (
    <Content className="eventsList">

      <div>
        {eventData.map(event => (
          <EventCard event={event} key={event.uuid} />
        ))}
     </div>

    </Content>
  );
}


function EventsPage(props: any) {
  const [eventData, setEventData] = useState<Array<ACMEvent>>([]);
  const [selectedEventKey, setSelectedEventKey] = useState("");
  useEffect(() => {
    fetchPastEvents().then((data) => {
      setEventData(data);
      console.log(data);
    });
  }, []);

  return (
    <DefaultLayout>
      <div className="Events">
        <Content>
          <div className="eventsTopBar">
          </div>
        </Content>

        <Content className="eventsHeader">
          <h1 className="title2">ACM AI Events</h1>
          <h4>ACM AI offers a breadth of socials and workshops to help keep our members engaged. We try our best ot make them as fun and exciting for everyone! </h4>
        </Content>

        <div className="eventsContent">
          <Tabs
            animated={true}
            onTabClick={(key) => setSelectedEventKey(key)}
            style = {{width: "100%"}}
            tabPosition="top"
            items={[{ label: <p>Upcoming Events</p>, key: "1", children: newEvents({eventData})}, { label: <p>Past Events</p>, key: "2", children: pastEvents({eventData})}]}
          ></Tabs>
        </div>




        <Footer className="eventsFooter">
          <Row className="row">
            <Col>
              <h2 className="title2">What events do we run?</h2>
              <p>We run all kinds of events, from intro to deep learning workshops to seminars from distinguished researchers and professors.
                Events are a great way to engage with the AI community at UCSD and learn content you may not
                typically learn in class! We also have a running contest ranking on Discord based on your performance on
                our latest Kahoot quizzes. We often host these quizzes at the start or end of a workshop.
              </p>
            </Col>
          </Row>

          <Row className="row">
            <Col>
              <h2 className="title2">Where can I find past workshops?</h2>
              <p>We post all of our workshop recordings on our YouTube at <a href='https://acmurl.com/youtube' target='_blank' rel="noopener noreferrer">https://acmurl.com/youtube</a>.
                Stay tuned in our Discord for uploads!
              </p>
            </Col>
          </Row>

          <h3>ACM AI at UCSD 2023</h3>
        </Footer>
      </div>

    </DefaultLayout>
  );
}

export default EventsPage;
