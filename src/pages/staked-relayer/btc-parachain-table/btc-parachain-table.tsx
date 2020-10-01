import React, { ReactElement, useEffect, useState } from "react";
import { StoreType } from "../../../common/types/util.types";
import { useSelector } from "react-redux";
import { Button } from "react-bootstrap";
import VoteModal from "../vote-modal/vote-modal";

const ADD_DATA_ERROR = "Add NO_DATA error";
const REMOVE_DATA_ERROR = "Remove NO_DATA error";
const INVALID_BTC_RELAY = "Add INVALID_BTC_RELAY error";

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
            proposedChanges: ADD_DATA_ERROR,
            hash: "00000000000000f86897a7d23e820beb593d30ce834e5bf4a3081e8254f325ab",
            votes: "49 : 20",
            result: "Accepted"
        },{
            id: "2",
            timestamp: "22020-09-21 10:59:13",
            proposedStatus: "Running",
            currentStatus: "Error",
            proposedChanges: REMOVE_DATA_ERROR,
            hash: "00000000000000f86897a7d23e820beb593d30ce834e5bf4a3081e8254f325ab",
            votes: "3 : 27",
            result: "Pending"
        },{
            id: "3",
            timestamp: "22020-09-21 10:59:13",
            proposedStatus: "Error",
            currentStatus: "Error",
            proposedChanges: INVALID_BTC_RELAY,
            hash: "000000000000008e5969f6f0b306d5e30a5cc78d9857def80b6f81390d34c5a1",
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
        switch(result){
            case "Accepted": return "green-text";
            case "Rejected": return "red-text";
            default: return ""; 
        };
    }

    const getCircle = (status: string): string =>{
        switch(status){
            case "Running": return "green-circle";
            case "Error": return "yellow-circle";
            default: return "red-circle"; 
        };
    }

    const getProposedChangesColor = (changes: string):string => {
        switch(changes){
            case ADD_DATA_ERROR: return "orange-text";
            case REMOVE_DATA_ERROR: return "green-text";
            default: return "red-text"; 
        };
    }

    const getPercentage = (votes: string, type: string): number => {
        const yes = Number(votes.split(":")[0]);
        const no = Number(votes.split(":")[1]);
        const total = yes + no;
        if (type === "yes") {
            return Number((yes/(total/100)).toFixed(1));
        }
        return Number((no/(total/100)).toFixed(1));
    }

    return <div className="btc-parachain-table">
        <VoteModal 
            show={showVoteModal} 
            onClose={handleClose} 
            parachain={parachainVote}
            getColor={getProposedChangesColor} ></VoteModal>
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
                                            {parachain.hash}
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
}