CREATE TABLE users (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    icon_url VARCHAR(1000),
    created_at TIMESTAMP DEFAULT now() NOT NULL,
    updated_at TIMESTAMP DEFAULT now() NOT NULL
);

CREATE TABLE rooms (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    emoji VARCHAR(1) NOT NULL,
    created_by VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT now() NOT NULL,
    updated_at TIMESTAMP DEFAULT now() NOT NULL,
    FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE TABLE room_members (
    id VARCHAR(255) PRIMARY KEY,
    room_id VARCHAR(255) NOT NULL,
    user_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT now() NOT NULL,
    updated_at TIMESTAMP DEFAULT now() NOT NULL,
    FOREIGN KEY (room_id) REFERENCES rooms(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT room_members_room_id_user_id_idx UNIQUE (room_id, user_id)
);

CREATE TABLE payments (
    id VARCHAR(255) PRIMARY KEY,
    room_id VARCHAR(255) NOT NULL,
    room_member_id VARCHAR(255) NOT NULL,
    amount INTEGER NOT NULL,
    note VARCHAR(255),
    created_at TIMESTAMP DEFAULT now() NOT NULL,
    updated_at TIMESTAMP DEFAULT now() NOT NULL,
    FOREIGN KEY (room_id) REFERENCES rooms(id),
    FOREIGN KEY (room_member_id) REFERENCES room_members(id)
);
CREATE INDEX payments_room_room_member_idx ON payments (room_id, room_member_id);
CREATE INDEX payments_created_at_desc_idx ON payments (created_at DESC);

-- drop table payments;
-- drop table room_members;
-- drop table rooms;
-- drop table users;
