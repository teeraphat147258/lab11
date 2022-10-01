import { checkToken } from "../../backendLibs/checkToken";
import { readChatRoomsDB } from "../../backendLibs/dbLib";

export default function roomRoute(req, res) {
  const user = checkToken(req);
  if (!user) {
    return res.status(401).json({
      ok: false,
      message: "Yon do not permission to access this api",
    });
  }

  const chatrooms = readChatRoomsDB();
  const data = [];
  for (const chart of chatrooms) {
    data.push({
      roomId: chart.roomId,
      roomName: chart.roomName,
    });
  }
  return res.json({ ok: true, rooms: data });

  //create room data and return response
}
