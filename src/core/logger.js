const KEY = "app_logs";

function readLogs() {
  return JSON.parse(localStorage.getItem(KEY) || "[]");
}

function writeLogs(logs) {
  localStorage.setItem(KEY, JSON.stringify(logs));
}

export const Logger = {
  info(message, ctx = {}) {
    const log = { level: "info", message, ctx, ts: new Date().toISOString() };
    const logs = readLogs();
    logs.push(log);
    writeLogs(logs);
  },
  error(message, ctx = {}) {
    const log = { level: "error", message, ctx, ts: new Date().toISOString() };
    const logs = readLogs();
    logs.push(log);
    writeLogs(logs);
  },
  warn(message, ctx = {}) {
    const log = { level: "warn", message, ctx, ts: new Date().toISOString() };
    const logs = readLogs();
    logs.push(log);
    writeLogs(logs);
  },
  list() {
    return readLogs();
  },
  clear() {
    writeLogs([]);
  },
};
