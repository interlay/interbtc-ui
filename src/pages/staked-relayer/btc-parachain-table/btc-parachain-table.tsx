import React, { ReactElement, useEffect, useState } from "react";
import { StoreType } from "../../../common/types/util.types";
import { useSelector } from "react-redux";
import { Button } from "react-bootstrap";
import VoteModal from "../vote-modal/vote-modal";

export default function BtcParachainTable ():ReactElement{
    const [parachainStatus,setStatus] = useState("Running");
    const polkaBTC = useSelector((state: StoreType) => state.api)
    const [parachains,setParachains] = useState([{}]);
    const [showVoteModal, setShowVoteModal] = useState(false);
    const handleClose = () => setShowVoteModal(false);
    const [parachainVote,setParachainVote] = useState();

    useEffect(()=>{
        setParachains([{
            id: "1",
            timestamp: "22020-09-21 10:59:13",
            proposedStatus: "Error",
            currentStatus: "Running",
            proposedChanges: "Add NO_DATA error",
            hash: "00000000000...42d948799f82d",
            votes: "49 : 20",
            result: "Accepted"
        },{
            id: "2",
            timestamp: "22020-09-21 10:59:13",
            proposedStatus: "Running",
            currentStatus: "Error",
            proposedChanges: "Remove NO_DATA error",
            hash: "00000000000...42d948799f82d",
            votes: "3 : 27",
            result: "Pending"
        },{
            id: "3",
            timestamp: "22020-09-21 10:59:13",
            proposedStatus: "Error",
            currentStatus: "Error",
            proposedChanges: "Add INVALID_BTC_RELAY error",
            hash: "00000000000...42d948799f82d",
            votes: "90 : 227",
            result: "Rejected"
        }]);
        const fetchData = async () => {
            if (!polkaBTC) return;
            
            let result = await polkaBTC.stakedRelayer.getCurrentStateOfBTCParachain();
            setStatus(result.isRunning ? "Running" : result.isError ? "Error" : "Shutdown");
        };
        fetchData();
    },[polkaBTC]);

    const openVoteModal = (parachain: any) => {
        setShowVoteModal(true);
        setParachainVote(parachain);
    };

    const getResultColor = (result: string): string => {
        if (result === "Accepted"){
            return "green-text";
        }
        if (result === "Rejected"){
            return "red-text";
        }
        return "";
    }

    const getCircle = (status: string): string =>{
        if(status === "Running"){
            return "green-circle";
        }
        if(status === "Error"){
            return "yellow-circle";
        }
        return "red-circle"
    }

    return <div className="btc-parachain-table">
        <VoteModal show={showVoteModal} onClose={handleClose} parachain={parachainVote} ></VoteModal>
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
                                    <td className={parachain.proposedStatus === "Running" ? "green-text" : "orange-text"}>{parachain.proposedStatus}</td>
                                    <td>{parachain.currentStatus}</td>
                                    <td>{parachain.proposedChanges}</td>
                                    <td>{parachain.hash}</td>
                                    <td>{parachain.votes}</td>
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
}