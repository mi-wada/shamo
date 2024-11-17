-- Insert users
INSERT INTO users (
  id, created_at
) VALUES (
  'u-0193381c-0697-7a75-a682-7791b0b12a9e', '2020-01-01T00:00:00+09:00'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO user_profiles (
  user_id, name, icon_url
) VALUES (
  'u-0193381c-0697-7a75-a682-7791b0b12a9e', 'Alice', 'https://api.dicebear.com/9.x/pixel-art/png?seed=Alice'
) ON CONFLICT (user_id) DO NOTHING;

INSERT INTO users (
  id, created_at
) VALUES (
  'u-0193381d-accd-75d7-923c-45ade433b48a', '2020-01-01T00:00:00+09:00'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO user_profiles (
  user_id, name, icon_url
) VALUES (
  'u-0193381d-accd-75d7-923c-45ade433b48a', 'Bob', 'https://api.dicebear.com/9.x/pixel-art/png?seed=Bob'
) ON CONFLICT (user_id) DO NOTHING;

-- Insert rooms
INSERT INTO rooms (
  id, name, emoji, created_at
) VALUES (
  'r-01933820-b95c-7c31-a107-32cdc7cae8ad', 'XXX', '🏠', '2020-01-01T00:00:00+09:00'
) ON CONFLICT (id) DO NOTHING;

-- Insert room_users
INSERT INTO room_users (
  room_id, user_id, payments_total_amount, created_at
) VALUES (
  'r-01933820-b95c-7c31-a107-32cdc7cae8ad', 'u-0193381c-0697-7a75-a682-7791b0b12a9e', 100, '2020-01-01T00:00:00+09:00'
) ON CONFLICT (room_id, user_id) DO NOTHING;
INSERT INTO room_users (
  room_id, user_id, payments_total_amount, created_at
) VALUES (
  'r-01933820-b95c-7c31-a107-32cdc7cae8ad', 'u-0193381d-accd-75d7-923c-45ade433b48a', 100, '2020-01-01T00:00:00+09:00'
) ON CONFLICT (room_id, user_id) DO NOTHING;

-- Insert payments
INSERT INTO payments (
  id, room_id, user_id, amount, note, created_at
) VALUES (
  'p-01933823-124a-79b5-a784-05422ee29229', 'r-01933820-b95c-7c31-a107-32cdc7cae8ad', 'u-0193381c-0697-7a75-a682-7791b0b12a9e', 100, 'ハンバーガー 🍔', '2020-01-01T00:00:00+09:00'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO payments (
  id, room_id, user_id, amount, note, created_at
) VALUES (
  'p-01933823-9f18-7603-8684-5907a79d731d', 'r-01933820-b95c-7c31-a107-32cdc7cae8ad', 'u-0193381d-accd-75d7-923c-45ade433b48a', 100, 'Pizza 🍕', '2020-01-01T00:00:00+09:00'
) ON CONFLICT (id) DO NOTHING;
