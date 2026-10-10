// Reuse Level 2's ASSETS delegation. This demo has no API or AWS connection.
export default {
  async fetch(request, env) {
    return env.ASSETS.fetch(request);
  }
};
