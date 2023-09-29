import React, { useEffect, useRef, useState } from 'react';
import './index.less';
import { useHistory, useParams } from 'react-router-dom';
import DefaultLayout from '../../../components/layouts/default';
import { getMetaData, getRanks } from '../../../actions/competition';
import { Table, Button, Modal } from 'antd';
import BackLink from '../../../components/BackLink';
import path from 'path';
import ChartJS from 'chart.js';
const chartConfig = {
  type: 'line',
  data: {
    labels: [0],
    datasets: [
      {
        label: 'MSE Score',
        data: [],
        backgroundColor: '#ff6f6f80',
        borderColor: '#ff6f6f',
      },
    ],
  },
  options: {
    responsive: true,
    title: {
      display: true,
      text: 'Score History',
    },
  },
};
const CompetitionLandingPage = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [updateTime, setUpdateTime] = useState<Date>();
  const [data, setData] = useState<any>([]);
  const [visible, setVisible] = useState(false);
  const [chart, setChart] = useState<ChartJS | null>(null);
  const chartContainer = useRef<HTMLCanvasElement>(null);
  const [scoreHistTitle, setScoreHistTitle] = useState('');
  const [meta, setMeta] = useState<{ competitionName?: string }>({});
  const params = useParams() as { id: string };
  const competitionID = params.id;

  const [chartTrigger, setTrigger] = useState(false);
  useEffect(() => {
    if (chartContainer && chartContainer.current) {
      const myChartRef = chartContainer!.current!.getContext('2d');
      const newchart = new ChartJS(myChartRef!, chartConfig);
      setChart(newchart);
    }
  }, [chartContainer, chartTrigger]);

  // uses a second hook to address bug where chartContainer ref does not update in time nor triggers callback
  useEffect(() => {
    setTrigger(visible);
  }, [visible]);

  const update = () => {
    getMetaData(competitionID).then((res) => {
      console.log('METADATA', res.data);
      setMeta(res.data);
    });
    getRanks(competitionID).then((res) => {
      let newData = [];
      newData = res.data.map((info: any) => {
        return {
          username: info.username,
          score: info.scoreHistory[info.scoreHistory.length - 1],
          scorehist: {
            startIndex: Math.max(info.scoreHistory.length - 10, 0),
            data: info.scoreHistory
              .slice(-10)
              .map((score: any, ind: number) => {
                return score.toFixed(6);
              }),
            username: info.username,
          },
        };
      });
      newData = newData
        .sort((a: any, b: any) => {
          return a.score - b.score;
        })
        .map((a: any, ind: number) => {
          return { ...a, username: `${ind + 1}. ${a.username}` };
        });
      setData(newData);
      setLoading(false);
      setUpdateTime(new Date());
    });
  };

  useEffect(() => {
    update();
  }, []);

  const cols = [
    {
      title: 'User',
      dataIndex: 'username',
    },
    {
      title: 'Latest Submission Score',
      dataIndex: 'score',
      render: (info: any) => {
        return <span>{info.toFixed(6)}</span>;
      },
    },
    {
      title: 'Score History',
      dataIndex: 'scorehist',
      render: (info: any) => {
        return (
          <Button
            onClick={() => {
              const data = info.data;
              setVisible(true);
              chartConfig.data.datasets[0].data = data;
              chartConfig.data.labels = [];
              for (let i = 0; i < data.length; i++) {
                chartConfig.data.labels.push(i + info.startIndex);
              }
              const title = 'Score history for ' + info.username;
              chartConfig.options.title.text = title;
              chart?.update();
              setScoreHistTitle(title);
            }}
          >
            View Score History
          </Button>
        );
      },
    },
  ];

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <DefaultLayout>
      <div className="CompetitionLandingPage">
        <br />
        <BackLink to="../" />
        <h2>{meta.competitionName}</h2>
        <p>
          The objective of this competition is to model a unknown function as
          accurately as possible!
          {/* All data, starter code can be found on{' '}
          <a href="https://github.com/acmucsd/NN-competition">the github</a>. */}
        </p>
        <p>
          This public leaderboard is ranked based on lowest Mean Squared Error
          scores, testing on 20% of the test data. Once the competition
          concludes, final results will be computed on 100% of the test data
        </p>
        <p>
          Once you submit your predictions, you will be placed onto the
          leaderboard!
        </p>
        <br />
        <Modal
          title={scoreHistTitle}
          open={visible}
          footer={null}
          onCancel={() => {
            setVisible(false);
          }}
        >
          <div>
            <canvas ref={chartContainer} />
          </div>
        </Modal>
        <Button
          onClick={() => {
            history.push(path.join(history.location.pathname, 'upload'));
          }}
        >
          Upload Predictions
        </Button>
        <Button
          className="refresh-btn"
          onClick={() => {
            update();
          }}
        >
          Refresh Leaderboard
        </Button>
        <br />
        <br />

        <Table loading={loading} columns={cols} dataSource={data} />
        {updateTime && <p>Last updated: {updateTime?.toLocaleString()}</p>}
      </div>
    </DefaultLayout>
  );
};

export default CompetitionLandingPage;
