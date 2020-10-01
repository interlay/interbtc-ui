import React, { ReactElement, useEffect, useState } from "react";
import { StoreType } from "../../../common/types/util.types";
import { useSelector } from "react-redux";
import { Button } from "react-bootstrap";
import VoteModal from "../vote-modal/vote-modal";

const ADD_DATA_ERROR = "Add NO_DATA error";
const REMOVE_DATA_ERROR = "Remove NO_DATA error";
const INVALID_BTC_RELAY = "Add INVALID_BTC_RELAY error";

interface StatusUpdate {
  id: string;
  timestamp: string;
  proposedStatus: string;
  currentStatus: string;
  proposedChanges: string;
  blockHash: string;
  votes: string;
  result: string;
}

interface Option<T> {
  isNone: boolean;
  unwrap(): T;
}

interface H256Le {
  toString(): string;
}

interface ErrorCode {
  toString(): string;
}

function displayBlockHash(option: Option<H256Le>): string {
  return option.isNone ? "None" : option.unwrap().toString();
}

function displayProposedChanges(
  addError: Option<ErrorCode>,
  removeError: Option<ErrorCode>
): string {
  return addError.isNone
    ? removeError.isNone
      ? "None"
      : removeError.unwrap().toString()
    : addError.unwrap().toString();
}

export default function BtcParachainTable(): ReactElement {
  const [parachainStatus, setStatus] = useState("Running");
  const polkaBTC = useSelector((state: StoreType) => state.api);
  const [parachains, setParachains] = useState([{}]);
  const [showVoteModal, setShowVoteModal] = useState(false);
  const handleClose = () => setShowVoteModal(false);
  const [parachainVote, setParachainVote] = useState();

  useEffect(() => {
    const fetchStatus = async () => {
      if (!polkaBTC) return;

      let result = await polkaBTC.stakedRelayer.getCurrentStateOfBTCParachain();
      setStatus(
        result.isRunning ? "Running" : result.isError ? "Error" : "Shutdown"
      );
    };

    const fetchUpdates = async () => {
      if (!polkaBTC) return;

      let result = await polkaBTC.stakedRelayer.getAllStatusUpdates();
      setParachains(
        result.map(
          (statusUpdate): StatusUpdate => {
            console.log(statusUpdate.btc_block_hash);
            return {
              id: "-",
              timestamp: statusUpdate.time.toString(),
              proposedStatus: statusUpdate.new_status_code.toString(),
              currentStatus: statusUpdate.old_status_code.toString(),
              proposedChanges: displayProposedChanges(
                statusUpdate.add_error,
                statusUpdate.remove_error
              ),
              blockHash: displayBlockHash(statusUpdate.btc_block_hash),
              votes: `${statusUpdate.tally.aye.size} : ${statusUpdate.tally.nay.size}`,
              result: statusUpdate.proposal_status.toString(),
            };
          }
        )
      );
    };
    
    fetchStatus();
    fetchUpdates();
  }, [polkaBTC]);

  const openVoteModal = (parachain: any) => {
    setShowVoteModal(true);
    setParachainVote(parachain);
  };

  const getResultColor = (result: string): string => {
    switch (result) {
      case "Accepted":
        return "green-text";
      case "Rejected":
        return "red-text";
      default:
        return "";
    }
  };

  const getCircle = (status: string): string => {
    switch (status) {
      case "Running":
        return "green-circle";
      case "Error":
        return "yellow-circle";
      default:
        return "red-circle";
    }
  };

  const getProposedChangesColor = (changes: string): string => {
    switch (changes) {
      case ADD_DATA_ERROR:
        return "orange-text";
      case REMOVE_DATA_ERROR:
        return "green-text";
      default:
        return "red-text";
    }
  };

  const getPercentage = (votes: string, type: string): number => {
    const yes = Number(votes.split(":")[0]);
    const no = Number(votes.split(":")[1]);
    const total = yes + no;
    if (type === "yes") {
      return Number((yes / (total / 100)).toFixed(1));
    }
    return Number((no / (total / 100)).toFixed(1));
  };

  return (
    <div className="btc-parachain-table">
      <VoteModal
        show={showVoteModal}
        onClose={handleClose}
        parachain={parachainVote}
        getColor={getProposedChangesColor}
      ></VoteModal>
      <div className="row">
        <div className="col-12">
          <div className="header">
            BTC Parachain Status:&nbsp; {parachainStatus}
            &nbsp; <div className={getCircle(parachainStatus)}></div>
          </div>
        </div>
      </div>
      <div className="row justify-content-center">
          <div className="col-12">
              <div className="table-wrapper">
                  <table>
                      <thead>
                          <tr>
                              <th>Id</th>
                              <th>Timestamp</th>
                              <th>Proposed Status</th>
                              <th>Current Status</th>
                              <th>Proposed Changes</th>
                              <th>BTC Block Hash</th>
                              <th>Votes (Yes : No)</th>
                              <th>Result</th>
                          </tr>
                      </thead>
                      <tbody>
                          {parachains.map((parachain: any, index)=>{
                              return <tr key={index}>
                                  <td>{parachain.id}</td>
                                  <td>{parachain.timestamp}</td>
                                  <td className={
                                          parachain.proposedStatus === "Running" ? "green-text" : "orange-text"}>
                                      {parachain.proposedStatus}
                                  </td>
                                  <td>{parachain.currentStatus}</td>
                                  <td className={getProposedChangesColor(parachain.proposedChanges)}>
                                      {parachain.proposedChanges}
                                  </td>
                                  <td className="break-words">
                                      <a href={"https://blockstream.info/testnet/block/" + parachain.hash} 
                                          target="_blank">
                                          {parachain.blockHash}
                                      </a>
                                  </td>
                                  <td> { parachain.votes && <React.Fragment>
                                          <p>
                                              <span className="green-text">
                                                  {getPercentage(parachain.votes,"yes")}%
                                              </span>
                                              <span>&nbsp;:&nbsp;</span>
                                              <span className="red-text">
                                                  {getPercentage(parachain.votes,"no")}%
                                              </span>
                                          </p>
                                          <p>
                                              <span className="green-text">
                                                  {parachain.votes.split(":")[0]}
                                              </span>
                                              <span>:</span>
                                              <span className="red-text">
                                                  {parachain.votes.split(":")[1]}
                                              </span>
                                          </p>
                                      </React.Fragment>
                                      }
                                  </td>
                                  <td className={getResultColor(parachain.result)}>{parachain.result === "Pending" ?
                                      <Button variant="outline-primary"
                                          onClick={()=>openVoteModal(parachain)}>
                                          Vote
                                      </Button> 
                                      : parachain.result}
                                  </td>
                              </tr>
                          })}
                      </tbody>
                  </table>
              </div>
          </div>
      </div>
    </div>
  );
}
