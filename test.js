const sql = 'SELECT * FROM photo_library WHERE user_id = ?'
const photos = (await (queryParamPromise(sql, [req.user])))


