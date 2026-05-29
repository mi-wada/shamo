import { Hono } from 'hono'
import { jsx } from 'hono/jsx'
import type { FC, PropsWithChildren } from 'hono/jsx'

// --- UUID v7 Helper ---
function uuidv7(): string {
  const now = Date.now();
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  bytes[0] = (now / 0x10000000000) & 0xff;
  bytes[1] = (now / 0x1000000) & 0xff;
  bytes[2] = (now / 0x10000) & 0xff;
  bytes[3] = (now / 0x100) & 0xff;
  bytes[4] = now & 0xff;
  bytes[5] = now & 0xff;
  bytes[6] = (bytes[6] & 0x0f) | 0x70;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = [...bytes].map(b => b.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

// --- Types ---
type Bindings = {
  DB: D1Database
}

type UserProfile = { user_id: string; name: string; icon_url: string }
type Room = { id: string; name: string; emoji: string; created_at: string }
type Payment = { id: string; user_id: string; amount: number; note: string; created_at: string; name: string; icon_url: string }
type UserWithBalance = {
  user_id: string
  name: string
  icon_url: string
  total_paid: number
}

const app = new Hono<{ Bindings: Bindings }>()

// --- UI Components ---
const Layout: FC<PropsWithChildren<{ roomId?: string }>> = ({ children, roomId }) => (
  <html lang="ja">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Shamo - Shared Money Management</title>
      <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="bg-slate-50 text-slate-900 min-h-screen antialiased">
      <nav class="bg-indigo-900 text-white p-4 sticky top-0 z-50 shadow-md">
        <div class="max-w-xl mx-auto flex justify-between items-center">
          <a href="/" class="text-xl font-black tracking-tighter flex items-center gap-1">🦆 Shamo</a>
          {roomId && (
            <a href={`/rooms/${roomId}/users`} class="text-xs bg-indigo-700 hover:bg-indigo-600 transition px-3 py-2 rounded-full font-bold flex items-center gap-1">
              ➕ メンバー追加 / 招待
            </a>
          )}
        </div>
      </nav>
      <main class="max-w-xl mx-auto p-4 space-y-6">{children}</main>
    </body>
  </html>
)

const Avatar: FC<{ url: string; name: string }> = ({ url, name }) => {
  if (url && url.startsWith('http')) {
    return <img src={url} alt={name} class="w-10 h-10 rounded-full object-cover border-2 border-white shadow" />
  }
  return (
    <div class="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center font-bold text-sm shadow">
      {name ? name.charAt(0) : '👤'}
    </div>
  )
}

// 支払い項目コンポーネント（ダッシュボードと全件表示ページで共通化・削除ボタン付 💡）
const PaymentItem: FC<{ p: Payment; roomId: string }> = ({ p, roomId }) => (
  <div class="bg-white p-3.5 rounded-xl border border-slate-200/50 shadow-sm flex items-center justify-between gap-3">
    <div class="flex items-center gap-3 min-w-0">
      <Avatar url={p.icon_url} name={p.name} />
      <div class="min-w-0">
        <div class="font-bold text-slate-800 text-sm truncate">{p.name}</div>
        <div class="text-xs text-slate-500 truncate">{p.note || '支出の記録'}</div>
      </div>
    </div>
    <div class="flex items-center gap-2.5 shrink-0">
      <div class="font-mono font-black text-slate-900 text-base">
        ¥{p.amount.toLocaleString()}
      </div>
      <form method="post" action={`/rooms/${roomId}/payments/${p.id}/delete`} class="m-0">
        <button type="submit" class="text-xs text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 p-1.5 rounded-lg transition font-bold" onclick="return confirm('この支払いを削除してよろしいですか？')">
          ✕
        </button>
      </form>
    </div>
  </div>
)

// --- Routes ---

// 1. Landing / Room Creation
app.get('/', (c) => {
  return c.html(
    <Layout>
      <div class="text-center py-8 space-y-4">
        <h1 class="text-4xl font-extrabold tracking-tight text-slate-900">共有でお金を<br />管理する。</h1>
        <p class="text-sm text-slate-500 max-w-sm mx-auto">割り勘や旅費の精算に。ログインやアプリのインストールは不要。ルームURLを共有するだけ。</p>
      </div>

      <form method="post" action="/rooms" class="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/60 space-y-4">
        <h2 class="text-lg font-bold text-slate-800">新しいルームを作成</h2>
        <div>
          <label class="block text-xs font-bold text-slate-400 mb-1">ルーム名</label>
          <input name="room_name" placeholder="沖縄旅行、シェアハウスの生活費など" class="w-full border border-slate-200 p-3 rounded-xl bg-slate-50/50 outline-none focus:border-indigo-500 text-sm" required />
        </div>
        <div>
          <label class="block text-xs font-bold text-slate-400 mb-1">あなたの名前</label>
          <input name="user_name" placeholder="たろう" class="w-full border border-slate-200 p-3 rounded-xl bg-slate-50/50 outline-none focus:border-indigo-500 text-sm" required />
        </div>
        <div>
          <label class="block text-xs font-bold text-slate-400 mb-1">アイコン画像URL（任意）</label>
          <input name="icon_url" placeholder="https://..." class="w-full border border-slate-200 p-3 rounded-xl bg-slate-50/50 outline-none focus:border-indigo-500 text-sm" />
        </div>
        <button type="submit" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl transition shadow-sm">
          ルームを作成する
        </button>
      </form>
    </Layout>
  )
})

// 2. Room Creation Logic
app.post('/rooms', async (c) => {
  const body = await c.req.parseBody()
  const roomId = uuidv7()
  const userId = crypto.randomUUID()
  const now = new Date().toISOString()
  const iconUrl = (body.icon_url as string) || '👤'

  await c.env.DB.batch([
    c.env.DB.prepare("INSERT INTO users (id, created_at) VALUES (?, ?)").bind(userId, now),
    c.env.DB.prepare("INSERT INTO user_profiles (user_id, name, icon_url) VALUES (?, ?, ?)").bind(userId, body.user_name, iconUrl),
    c.env.DB.prepare("INSERT INTO rooms (id, name, emoji, created_at) VALUES (?, ?, ?, ?)").bind(roomId, body.room_name, '💰', now),
    c.env.DB.prepare("INSERT INTO room_users (room_id, user_id, payments_total_amount, created_at) VALUES (?, ?, ?, ?)").bind(roomId, userId, 0, now)
  ])

  return c.redirect(`/rooms/${roomId}`)
})

// 3. Room Dashboard (直近20件のみ表示 💡)
app.get('/rooms/:id', async (c) => {
  const roomId = c.req.param('id')
  const room = await c.env.DB.prepare("SELECT * FROM rooms WHERE id = ?").bind(roomId).first<Room>()

  if (!room) return c.text("Room Not Found", 404)

  const usersWithBalance = await c.env.DB.prepare(`
    SELECT
      p.user_id,
      p.name,
      p.icon_url,
      COALESCE(SUM(pay.amount), 0) AS total_paid
    FROM user_profiles p
    JOIN room_users ru ON p.user_id = ru.user_id
    LEFT JOIN payments pay ON p.user_id = pay.user_id AND pay.room_id = ru.room_id
    WHERE ru.room_id = ?
    GROUP BY p.user_id
  `).bind(roomId).all<UserWithBalance>()

  // 直近20件のみ取得 💡
  const payments = await c.env.DB.prepare(`
    SELECT pay.*, prof.name, prof.icon_url FROM payments pay
    JOIN user_profiles prof ON pay.user_id = prof.user_id
    WHERE pay.room_id = ?
    ORDER BY pay.created_at DESC
    LIMIT 20
  `).bind(roomId).all<Payment>()

  // 誘導判定用に総件数をカウント 💡
  const countResult = await c.env.DB.prepare(`
    SELECT COUNT(*) as count FROM payments WHERE room_id = ?
  `).bind(roomId).first<{ count: number }>()

  const totalCount = countResult?.count || 0

  // 支出合計は全件合計を出すために別途SUM 💡
  const sumResult = await c.env.DB.prepare(`
    SELECT SUM(amount) as total FROM payments WHERE room_id = ?
  `).bind(roomId).first<{ total: number | null }>()

  const totalAmount = sumResult?.total || 0

  return c.html(
    <Layout roomId={roomId}>
      <div class="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col gap-3">
        <div class="flex items-center gap-2">
          <span class="text-2xl">{room.emoji}</span>
          <h1 class="text-xl font-bold text-slate-800">{room.name}</h1>
        </div>
        <div class="bg-slate-50 p-3.5 rounded-xl flex justify-between items-center border border-slate-100">
          <span class="text-sm text-slate-500 font-medium">ルーム全体の合計支出</span>
          <span class="text-xl font-black text-indigo-600">¥{totalAmount.toLocaleString()}</span>
        </div>
      </div>

      <section class="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm space-y-3">
        <h2 class="text-sm font-bold text-slate-400 uppercase tracking-wider">👥 メンバーの支払総額</h2>
        <div class="divide-y divide-slate-100">
          {usersWithBalance.results.map(u => (
            <div class="flex items-center justify-between py-2.5 first:pt-0 last:pb-0">
              <div class="flex items-center gap-3">
                <Avatar url={u.icon_url} name={u.name} />
                <span class="font-bold text-slate-700 text-sm">{u.name}</span>
              </div>
              <span class="font-mono font-bold text-slate-900 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">
                ¥{u.total_paid.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section class="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm space-y-3">
        <h2 class="text-sm font-bold text-slate-400 uppercase tracking-wider">💸 支払いを記録</h2>
        <form method="post" action={`/rooms/${roomId}/payments`} class="space-y-3">
          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="block text-[10px] font-black text-slate-400 mb-1">支払った人</label>
              <select name="user_id" class="w-full border border-slate-200 p-2.5 rounded-xl bg-slate-50/50 text-sm font-medium outline-none" required>
                {usersWithBalance.results.map(u => <option value={u.user_id}>{u.name}</option>)}
              </select>
            </div>
            <div>
              <label class="block text-[10px] font-black text-slate-400 mb-1">金額 (円)</label>
              <input type="number" name="amount" placeholder="金額" class="w-full border border-slate-200 p-2.5 rounded-xl bg-slate-50/50 font-mono text-sm outline-none" required />
            </div>
          </div>
          <div>
            <label class="block text-[10px] font-black text-slate-400 mb-1">使い道・メモ</label>
            <input name="note" placeholder="例：夜ごはんの食材、ガソリン代" class="w-full border border-slate-200 p-2.5 rounded-xl bg-slate-50/50 text-sm outline-none" />
          </div>
          <button type="submit" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition shadow-sm text-sm">
            記録する
          </button>
        </form>
      </section>

      {/* 支払い履歴（直近20件 💡） */}
      <section class="space-y-3">
        <div class="flex justify-between items-center">
          <h2 class="text-sm font-bold text-slate-400 uppercase tracking-wider">📋 最近の履歴 (20件まで)</h2>
          {totalCount > 20 && (
            <a href={`/rooms/${roomId}/payments`} class="text-xs font-bold text-indigo-600 hover:underline">
              全件見る ({totalCount}件) →
            </a>
          )}
        </div>
        <div class="space-y-2">
          {payments.results.length === 0 ? (
            <div class="bg-white rounded-2xl border p-8 text-center text-sm text-slate-400 border-dashed">
              まだ支払いの記録はありません
            </div>
          ) : (
            <>
              {payments.results.map(p => (
                <PaymentItem p={p} roomId={roomId} />
              ))}
              {totalCount > 20 && (
                <div class="pt-2 text-center">
                  <a href={`/rooms/${roomId}/payments`} class="inline-block bg-slate-200 hover:bg-slate-300 transition text-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl">
                    すべての履歴を表示 ({totalCount}件)
                  </a>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </Layout>
  )
})

// 4. 全件履歴表示ページ (新規追加 💡)
app.get('/rooms/:id/payments', async (c) => {
  const roomId = c.req.param('id')
  const room = await c.env.DB.prepare("SELECT * FROM rooms WHERE id = ?").bind(roomId).first<Room>()
  if (!room) return c.text("Room Not Found", 404)

  // 制限なしで全件取得 💡
  const payments = await c.env.DB.prepare(`
    SELECT pay.*, prof.name, prof.icon_url FROM payments pay
    JOIN user_profiles prof ON pay.user_id = prof.user_id
    WHERE pay.room_id = ?
    ORDER BY pay.created_at DESC
  `).bind(roomId).all<Payment>()

  return Sandy = c.html(
    <Layout>
      <div class="space-y-2">
        <a href={`/rooms/${roomId}`} class="text-xs font-bold text-indigo-600 flex items-center gap-1">← ルームに戻る</a>
        <h1 class="text-xl font-bold text-slate-800">📋 すべての支払い履歴</h1>
        <p class="text-xs text-slate-500">{room.emoji} {room.name} の全精算データ ({payments.results.length}件)</p>
      </div>

      <div class="space-y-2">
        {payments.results.length === 0 ? (
          <div class="bg-white rounded-2xl border p-8 text-center text-sm text-slate-400 border-dashed">
            まだ支払いの記録はありません
          </div>
        ) : (
          payments.results.map(p => (
            <PaymentItem p={p} roomId={roomId} />
          ))
        )}
      </div>
    </Layout>
  )
})

// 5. 別ページ化したメンバー追加・招待ページ
app.get('/rooms/:id/users', async (c) => {
  const roomId = c.req.param('id')
  const room = await c.env.DB.prepare("SELECT * FROM rooms WHERE id = ?").bind(roomId).first<Room>()
  if (!room) return c.text("Room Not Found", 404)

  const users = await c.env.DB.prepare(`
    SELECT p.* FROM user_profiles p
    JOIN room_users ru ON p.user_id = ru.user_id
    WHERE ru.room_id = ?
  `).bind(roomId).all<UserProfile>()

  return c.html(
    <Layout>
      <div class="space-y-2">
        <a href={`/rooms/${roomId}`} class="text-xs font-bold text-indigo-600 flex items-center gap-1">← ルームに戻る</a>
        <h1 class="text-xl font-bold text-slate-800">メンバーの追加・招待</h1>
      </div>

      <div class="bg-indigo-50 p-4 rounded-2xl border border-indigo-100 space-y-2">
        <div class="text-xs font-bold text-indigo-800">🔗 メンバー招待URL</div>
        <div class="text-xs bg-white p-2.5 rounded-lg border border-indigo-200 font-mono text-slate-600 break-all select-all">
          {c.req.url.replace('/users', '')}
        </div>
        <p class="text-[11px] text-indigo-500">このURLをLINEやメッセージで送ると、他の人も同じルームに参加できます。</p>
      </div>

      <form method="post" action={`/rooms/${roomId}/users`} class="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm space-y-4">
        <h2 class="text-sm font-bold text-slate-400 uppercase tracking-wider">➕ メンバーを追加する</h2>
        <div>
          <label class="block text-xs font-bold text-slate-500 mb-1">名前</label>
          <input name="user_name" placeholder="はなこ" class="w-full border border-slate-200 p-3 rounded-xl bg-slate-50/50 text-sm outline-none focus:border-indigo-500" required />
        </div>
        <div>
          <label class="block text-xs font-bold text-slate-500 mb-1">アイコン画像URL（任意）</label>
          <input name="icon_url" placeholder="https://..." class="w-full border border-slate-200 p-3 rounded-xl bg-slate-50/50 text-sm outline-none focus:border-indigo-500" />
        </div>
        <button type="submit" class="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 rounded-xl transition text-sm">
          メンバーを追加
        </button>
      </form>

      <section class="space-y-2">
        <h2 class="text-sm font-bold text-slate-400 uppercase tracking-wider">👥 現在のメンバー ({users.results.length}人)</h2>
        <div class="bg-white rounded-2xl border border-slate-200/60 p-3 divide-y divide-slate-100">
          {users.results.map(u => (
            <div class="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
              <Avatar url={u.icon_url} name={u.name} />
              <span class="font-bold text-slate-700 text-sm">{u.name}</span>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  )
})

// 6. ユーザー登録ロジック
app.post('/rooms/:id/users', async (c) => {
  const roomId = c.req.param('id')
  const body = await c.req.parseBody()
  const userId = crypto.randomUUID()
  const now = new Date().toISOString()
  const iconUrl = (body.icon_url as string) || '👤'

  await c.env.DB.batch([
    c.env.DB.prepare("INSERT INTO users (id, created_at) VALUES (?, ?)").bind(userId, now),
    c.env.DB.prepare("INSERT INTO user_profiles (user_id, name, icon_url) VALUES (?, ?, ?)").bind(userId, body.user_name, iconUrl),
    c.env.DB.prepare("INSERT INTO room_users (room_id, user_id, payments_total_amount, created_at) VALUES (?, ?, ?, ?)").bind(roomId, userId, 0, now)
  ])

  return c.redirect(`/rooms/${roomId}/users`)
})

// 7. 決済登録ロジック
app.post('/rooms/:id/payments', async (c) => {
  const roomId = c.req.param('id')
  const body = await c.req.parseBody()
  const paymentId = crypto.randomUUID()
  const now = new Date().toISOString()

  await c.env.DB.prepare(`
    INSERT INTO payments (id, room_id, user_id, amount, note, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `).bind(paymentId, roomId, body.user_id, Number(body.amount), body.note, now).run()

  return c.redirect(`/rooms/${roomId}`)
})

// 8. 決済削除ロジック (新規追加 💡)
app.post('/rooms/:id/payments/:payment_id/delete', async (c) => {
  const roomId = c.req.param('id')
  const paymentId = c.req.param('payment_id')

  await c.env.DB.prepare(`
    DELETE FROM payments
    WHERE id = ? AND room_id = ?
  `).bind(paymentId, roomId).run()

  // 元いた場所を特定して、適切にリダイレクトさせるためにリファラを確認（全件ページからの削除に対応）
  const referer = c.req.header('referer')
  if (referer && referer.endsWith('/payments')) {
    return c.redirect(`/rooms/${roomId}/payments`)
  }
  return c.redirect(`/rooms/${roomId}`)
})

export default app
