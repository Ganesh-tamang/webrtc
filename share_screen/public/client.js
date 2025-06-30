const socket = io();
const video = document.getElementById("screen");
const peerConnections = {};
const stats = document.getElementById("status");

let localStream;
const button = document.getElementById("button")
const cancelBtn = document.getElementById("cancelShareBtn");

socket.emit("send_sharerid")

socket.on("sharerid", (sharerId)=>{
  if (sharerId){
  stats.textContent = `View shared screen from userid: ${sharerId}.`;
  // button.style.display = "none"
  button.textContent = "join share"
  }

});
button.onclick = ()=> {
  socket.emit("join-room")
  cancelBtn.style.display = "inline"; // show cancel
  button.style.display = "none";
};
 cancelBtn.onclick = ()=> {
  stopSharing();
 };
 function stopSharing() {
  if (localStream) {
    localStream.getTracks().forEach(track => track.stop());
    localStream = null;
  }

  // video.srcObject = null;
  cancelBtn.style.display = "none";
  button.style.display = "inline";
  stats.textContent = "stopped sharing.";
}

socket.on("you-are-sharer", async () => {
  console.log("You are the screen sharer");
  localStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
  video.srcObject = localStream;

  socket.on("new-viewer", async (viewerId) => {
    const pc = createPeer(viewerId);
    localStream.getTracks().forEach(track => pc.addTrack(track, localStream));
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    socket.emit("offer", { target: viewerId, sdp: offer });
  });
});

socket.on("connect-to-sharer", async (sharerId) => {
  const pc = createPeer(sharerId);
  socket.on("offer", async ({ sdp, from }) => {
    await pc.setRemoteDescription(new RTCSessionDescription(sdp));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    socket.emit("answer", { target: from, sdp: answer });
  });
});

function createPeer(id) {
  const pc = new RTCPeerConnection();
  peerConnections[id] = pc;

  pc.onicecandidate = (event) => {
    if (event.candidate) {
      socket.emit("ice-candidate", {
        target: id,
        candidate: event.candidate
      });
    }
  };

  pc.ontrack = (event) => {
    if (!video.srcObject) {
      video.srcObject = event.streams[0];
    }
  };

  return pc;
}

socket.on("answer", async ({ sdp, from }) => {
  const pc = peerConnections[from];
  await pc.setRemoteDescription(new RTCSessionDescription(sdp));
});

socket.on("ice-candidate", async ({ from, candidate }) => {
  const pc = peerConnections[from];
  if (candidate) {
    await pc.addIceCandidate(new RTCIceCandidate(candidate));
  }
});

socket.on("sharer-left", () => {
  alert("Sharer disconnected");
  window.location.reload();
});


window.addEventListener("beforeunload", (event) => {
  event.preventDefault();
  event.returnValue="";
});