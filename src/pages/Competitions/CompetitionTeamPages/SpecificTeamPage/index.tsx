import React, { useEffect, useState, useContext } from 'react';
import DefaultLayout from '../../../../components/layouts/default';
import './index.less';
import { useParams } from 'react-router-dom';
import { getRegisteredState, getTeamInfo, getSubmissionDetails } from '../../../../actions/teams/utils';
import UserContext from '../../../../UserContext';
import BackLink from '../../../../components/BackLink';
import { Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import {useHistory} from "react-router-dom";
import path from 'path';
interface SubmissionData {
  description: string;
  score: number;
  tags: string;
  date: Date;
  dateString: string;
  key: string;
}

const columns: ColumnsType<SubmissionData> = [
  {
    title: 'Submission Date',
    dataIndex: 'dateString',
    defaultSortOrder: 'descend',
    sorter: (a, b) => a.date.getTime() - b.date.getTime()
  },
  {
    title: 'Status',
    dataIndex: 'status',
    render(value, record, index) {
        if (value === 1) {
          return "verifying"
        } else if (value === 2) {
          return "verified"
        } else if (value === 3) {
          return "failed"
        }
    },
  },
  {
    title: 'Description',
    dataIndex: 'description',
  },
  {
    title: 'Tags',
    dataIndex: 'tags',
  },
  {
    title: 'Score',
    dataIndex: 'score',
    sorter: (a, b) => a.score - b.score,
  },
];

const CompetitionSpecificTeamPage = () => {

  const { user } = useContext(UserContext);
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const [teamInfo, setTeamInfo] = useState<any>({});
  const [teamMembers, setTeamMembers] = useState<any>([]);
  const [isMyTeam, setIsMyTeam] = useState<boolean>(false);
  const [submissionData, setSubmissionData] = useState<SubmissionData[]>([]);
  const [submissionIds, setSubmissionIds] = useState<any>([]);
  let { competitionName, teamName } = useParams<{ competitionName: string, teamName: string }>();
  const username = user.username; // replace with user.username
  const history = useHistory();
  // Check if user is logged in
  useEffect(() => {
    if (user.loggedIn) {
      // TODO: it's hardcoded to "testinguser1"; change it to user.username
      getRegisteredState(competitionName, username).then((res) => {
        setIsRegistered(res.data.registered);
      })
    }
  }, []);

  // Get info on team if user is registered in competition
  useEffect(() => {
    if (isRegistered) {
      getTeamInfo(competitionName, teamName).then((res) => {
        setTeamInfo(res.data);
        setTeamMembers(res.data.teamMembers);
      });
    }
  }, [isRegistered])

  // Retrieve submission IDs if user is in their team's page
  useEffect(() => {
    if (teamMembers.length > 0 && teamMembers.includes(username)) {
      setIsMyTeam(true);
      setSubmissionIds(teamInfo.submitHistory);
    }
  }, [teamMembers])

  // Get submission data from submission IDs
  useEffect(() => {
    submissionIds.map((id: any) => {
      getSubmissionDetails(competitionName, id).then((res) => {
        let submission = res.data[0];
        if (!submission) return;
        let date = new Date(submission.submissionDate);
        let submissionDetails = {
          date: date,
          status: submission.status,
          dateString: date.toLocaleDateString() + " at " + date.toLocaleTimeString(),
          description: submission.description,
          tags: submission.tags.join(", "),
          score: submission.rank.score,
          key: id
        }
        setSubmissionData(submissionData => [...submissionData, submissionDetails]);
      })
    })
  }, [submissionIds])

  return (
    <DefaultLayout>
      <div className="CompetitionSpecificTeamPage">
        <br />
        <BackLink to="../" />
        {isRegistered ? (
          <div className='main-section'>
            <h2>Team {teamInfo.teamName}</h2>
            {isMyTeam &&
              <div className='block'>
                <p>Invite your friends to join this team!</p>
                <h4>Join Code: {teamInfo.joinCode}</h4>
              </div>
            }
            <h3><span className="subheader">Best Score: {teamInfo.bestScore}</span></h3>

            <h3><span className="subheader">Members</span></h3>
            <div>
              {teamMembers.map((member: string) => {
                return <li key={member}>{member}</li>
              })}
            </div>

            <h3><span className="subheader">About</span></h3>
            <p>{teamInfo.teamDescription}</p>

            {isMyTeam &&
              <>
                <h3>Submissions</h3>
                <Table columns={columns} dataSource={submissionData} onRow={(record, rowIndex) => {
                  return {
                    onClick: (event) => {
                      // history.pushState()
                      
                      history.push(path.join(window.location.pathname, "submissions", record.key));
                      console.log({event, record})
                    }
                  }
                }} />
              </>
            }
          </div>
        ):(
          <p className='errorMessage'>
            You must be registered in this competition AND logged in to this site to view this page.
          </p>
        )}
      </div>
    </DefaultLayout>
  )
}
export default CompetitionSpecificTeamPage;