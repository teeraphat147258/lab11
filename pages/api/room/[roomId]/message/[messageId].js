import { checkToken } from "../../../../../backendLibs/checkToken";
import {
  readChatRoomsDB,
  writeChatRoomsDB,
} from "../../../../../backendLibs/dbLib";

export default function roomIdMessageIdRoute(req, res) {
  if (req.method === "DELETE") {
    //check token
    const user = checkToken(req);
    if (!user) {
      return res.status(401).json({
        ok: false,
        message: "Yon do not permission to access this api",
      });
    }
    //get ids from url
    const roomId = req.query.roomId;
    const messageId = req.query.messageId;
    const rooms = readChatRoomsDB();
    const roomIdIDX = rooms.findIndex((x) => x.roomId === roomId);
    //check if roomId exist
    if (roomIdIDX === -1)
      return res.status(404).json({ ok: false, message: "Invalid room id" });

    const mes = rooms[roomIdIDX].messages;
    const mesIdIDX = mes.findIndex((x) => x.messageId === messageId);
    //check if messageId exist
    if (mesIdIDX === -1)
      return res.status(404).json({ ok: false, message: "Invalid message id" });
    //check if token owner is admin, they can delete any message
    //or if token owner is normal user, they can only delete their own message!
    if (!user.isAdmin) {
      if (mes[mesIdIDX].username === user.username) {
        mes.splice(mesIdIDX, 1);
        writeChatRoomsDB(rooms);
        return res.json({ ok: true });
      } else {
        return res.status(403).json({
          ok: false,
          message: "Yon do not permission to access this data",
        });
      }
    } else {
      mes.splice(mesIdIDX, 1);
      writeChatRoomsDB(rooms);
      return res.json({ ok: true });
    }
  }
}