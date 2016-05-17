import TimedBoard from '../models/TimedBoard.js';
import helper from './helper.js';

export default {
  addTimedBoard: (req, res) => {
    const { title, timerLength } = req.body;
    const boardId = req.params.board_id;
    const authorId = req.user.sub;
    const newTimedBoard = new TimedBoard({ title, authorId, boardId, timerLength });

    newTimedBoard.save()
      .then((board) => {
        res.status(201).json({ board });
      })
      .error(helper.handleError(res));
  },

  getTimedBoard: (req, res) => {
    const id = req.params.timed_board_id;

    TimedBoard.get(id).getJoin({
      timedIdeas: {
        _apply: (sequence) => sequence.orderBy('createdAt'),
      },
    }).run()
      .then((board) => {
        res.status(200).json({ board });
      })
      .error(helper.handleError(res));
  },
};
