const {ICE_SERVERS} = require("./constants")
const {RTCPeerConnection} = require("wrtc")

const offerPeerConnection = async (player, client, playerNo) => {
  const peerConnection = new RTCPeerConnection(ICE_SERVERS);

  peerConnection.onicecandidate = (event) => {
    if(event.candidate){
      client.emit('wrtc:iceCandidate', event.candidate)
    }
  }

  client.on('iceCandidate', (candidate) => {
    peerConnection.addIceCandidate(candidate)
  })

  const dataChannel = peerConnection.createDataChannel("gameState:stream");

  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);

  client.emit("wrtc:offer", offer);

  player.peerConnection = peerConnection;
  player.gameStateStreamDataChannel = dataChannel;

  dataChannel.onopen = (event) => {
    client.emit('init', playerNo);
  }

  peerConnection.onicecandidate = (event) => {
    if(event.candidate){
      client.emit("wrtc:iceCandidate", event.candidate);
    } 
  }

  client.on("wrtc:answer", async (answer) => {
    await peerConnection.setRemoteDescription(answer);
  })

  client.on("wrtc:iceCandidate", (candidate) => {
    peerConnection.addIceCandidate(candidate);
  })
}

module.exports = {
  offerPeerConnection,
}