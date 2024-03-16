import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Socket, io} from "socket.io-client";

const URL = "http://localhost:3000";

export const Room = ({
    name,
    localAudioTrack,
    localVideoTrack,
}: {
    name: string,
    localAudioTrack: MediaStreamTrack | null,
    localVideoTrack: MediaStreamTrack | null
}) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [lobby, setLobby] = useState(true);
    const [socket, setSocket] = useState<null | Socket>(null);
    const [sendingPc, setSendingPc] = useState<null | RTCPeerConnection>(null);
    const [receivingPc, setReceivingPc] = useState<null | RTCPeerConnection>(null);
    const [remoteVideoTrack, setRemoteVideoTrack] = useState<null | MediaStreamTrack>(null);
    const [remoteAudioTrack, setRemoteAudioTrack] = useState<null | MediaStreamTrack>(null);
    const [remoteMediaStream, setRemoteMediaStream] = useState<null | MediaStream>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const localVideoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const socket = io(URL);

        socket.on("send-offer", async ({roomId}) => {
            setLobby(false);
            const pc = new RTCPeerConnection();
            setSendingPc(pc);
            if(localAudioTrack) pc.addTrack(localAudioTrack);
            if(localVideoTrack) pc.addTrack(localVideoTrack);

            // pc.onicecandidate = (e) => {
            //     if(!e.candidate) return;
            //     pc.addIceCandidate(e.candidate);
            // }

            pc.onnegotiationneeded = async () => {
                const offerDesc = await pc.createOffer();
                // @ts-ignore
                pc.setLocalDescription(offerDesc);
                socket.emit("offer", {
                    sdp: offerDesc.sdp,
                    roomId
                });
            }
        });

        socket.on("offer", async ({sdp, roomId}) => {
            setLobby(false);
            const pc = new RTCPeerConnection();
            pc.setRemoteDescription({
                type: "offer",
                sdp
            });
            const answerDesc = await pc.createAnswer();
            // @ts-ignore
            pc.setLocalDescription(answerDesc);
            const stream = new MediaStream();
            if(remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = stream;
            }
            setRemoteMediaStream(stream);
            setReceivingPc(pc);

            // @ts-ignore
            pc.ontrack(({track, type}) => {
                // @ts-ignore
                remoteVideoRef.current.srcObject.addTrack(track);
                // @ts-ignore
                remoteVideoRef.current.play();
            });

            socket.emit("answer", {
                sdp: answerDesc.sdp,
                roomId
            });
        });

        socket.on("answer", async ({sdp, roomId}) => {
            setLobby(false);
            setSendingPc((prevPc) => {
                prevPc?.setRemoteDescription({
                    type: "answer",
                    sdp
                });
                return prevPc;
            });

            // @ts-ignore
            // sendingPc.ontrack((event) => {
            //     if(event.track.kind == "audio") {
            //         setLocalAudioTrack(event.track);
            //     } else {
            //         setLocalVideoTrack(event.track);
            //     }
            // });
        });

        socket.on("lobby", () => {
            setLobby(true);
        })

        setSocket(socket);

        return () => {
            socket.disconnect();
        };
    }, [name]);

    useEffect(() => {
        if(localVideoRef.current) {
            if(localVideoTrack) {
                localVideoRef.current.srcObject = new MediaStream([localVideoTrack!]);
                localVideoRef.current.play();
            }
        }
    }, [localVideoRef])

    return (
        <div>
            <h1>Room for {name}</h1>
            <video autoPlay height={400} width={400} ref={localVideoRef}></video>
            {lobby ? (
                <h1>Waiting for connecting to someone</h1>
            ) : (
                <>
                    <h1>Connected</h1>
                    <video autoPlay height={400} width={400} ref={remoteVideoRef}></video>
                </>
            )}
        </div>
    )
}