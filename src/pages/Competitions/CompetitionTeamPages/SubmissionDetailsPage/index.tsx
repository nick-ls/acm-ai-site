import React, { useEffect, useState } from 'react';
import DefaultLayout from '../../../../components/layouts/default';
import './index.less';
import { Link, useParams } from 'react-router-dom';
import { getSubmissionDetails, getTeamInfo } from '../../../../actions/teams/utils';
import { Button, Table } from 'antd';
import BackLink from '../../../../components/BackLink';
import { getSubmissionMatches, getSubmissionReplay } from '../../../../actions/competition';
import { ColumnsType } from 'antd/lib/table';
const columns: ColumnsType<MatchData> = [
  {
    title: 'ID',
    dataIndex: '_id',
  },
  {
    title: "Teams",
    render(value, record, index) {
      return value.competitionTeams.map((v: any) => v.teamName).join(", ");
    },
  },
  {
    title: 'Date',
    dataIndex: 'date',
    defaultSortOrder: 'descend',
    sorter: (a, b) => (new Date(a.date).getTime()) - (new Date(b.date).getTime()),
    render(value, record, index) {
        return new Date(value).toLocaleString();
    },
  },
];
interface MatchData {
  competitionTeams: string[];
  competitionEntries: string[];
  _id: string;
  date: Date;
}

const CompetitionSubmissionDetailsPage = () => {
  let { competitionName, submissionId, teamName } = useParams<{
    competitionName: string;
    teamName: string;
    submissionId: string;
  }>();


  const [submissionDetails, setSubmissionDetails] = useState<any>(null);
  const [submissionMatches, setSubmissionMatches] = useState<any>(null);
  const [teams, setTeams] = useState<Record<string, string>>({});
  useEffect(() => {
    getSubmissionDetails(competitionName, submissionId).then((res) => {
      setSubmissionDetails(res.data[0]);
    });
    getSubmissionMatches(competitionName, submissionId).then((res) => {
      console.log("Retrieved Match Data");
      setSubmissionMatches(res.data);
      // getSubmissionReplay(competitionName, res.data[0]._id).then((res) => {
      // });
    });
  }, []);

  if (!submissionMatches || !submissionDetails) {
    return <DefaultLayout></DefaultLayout>
  }
  console.log({submissionDetails})
  return (
    <DefaultLayout>
      <div className="SubmissionDetailsPage">
        <br />
        <Link to={`../`}>
          <Button className="headerbtn">Back to Team</Button>
        </Link>
        <h2>Submission {submissionId}</h2>
        <p>Ranking Score = µ - 3 * σ = {submissionDetails.rank.score}</p>
        <p>µ = {submissionDetails.rank.mu}</p>
        <p>σ = {submissionDetails.rank.sigma}</p>
        <div>
        <Table columns={columns} dataSource={submissionMatches} />
        </div>
      </div>
    </DefaultLayout>
  );
};
export default CompetitionSubmissionDetailsPage;