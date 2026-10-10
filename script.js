// Fictional resource identities and findings. No network calls or AWS access.
const accounts = {
  production: { name: 'Production', id: '111122223333' },
  staging: { name: 'Staging', id: '444455556666' },
  development: { name: 'Development', id: '777788889999' }
};
const findings = {
  publicBucket: { title: 'Public bucket access', severity: 'Critical', description: 'S3 Block Public Access is disabled and a bucket policy allows anonymous reads. This could expose objects outside the account.', remediation: 'Enable all four S3 Block Public Access settings and remove the public-read statement after reviewing intended consumers.' },
  openSSH: { title: 'SSH open to the internet', severity: 'Critical', description: 'The attached security group allows inbound TCP port 22 from 0.0.0.0/0. This increases exposure to unauthorized connection attempts.', remediation: 'Remove the unrestricted SSH ingress rule and use an approved management path such as Systems Manager Session Manager.' },
  imds: { title: 'IMDSv2 not enforced', severity: 'High', description: 'The instance metadata endpoint accepts optional session tokens, allowing IMDSv1 requests.', remediation: 'Require IMDSv2 tokens after checking that the application and its agents support token-based metadata requests.' },
  logging: { title: 'Access logging disabled', severity: 'Medium', description: 'Server access logging is disabled for this bucket, reducing visibility into object access requests.', remediation: 'Enable server access logging to a dedicated log bucket with the required log-delivery policy and retention settings.' },
  versioning: { title: 'Versioning disabled', severity: 'Medium', description: 'Bucket versioning is disabled. Accidental overwrites or deletions may be difficult to recover.', remediation: 'Enable bucket versioning and agree on a lifecycle policy for noncurrent versions to control storage costs.' },
  unencryptedVolume: { title: 'Unencrypted EBS volume', severity: 'High', description: 'An attached EBS data volume is not encrypted at rest.', remediation: 'Create an encrypted copy from a snapshot, then replace the volume during an approved maintenance window with a rollback plan.' }
};
// Six resources per account; one finding per affected resource.
const resources = [
  { name: 'prod-api-01', id: 'i-0a1b2c3d4e5f60001', type: 'EC2', account: 'production', region: 'ap-southeast-1', finding: 'openSSH' },
  { name: 'prod-api-02', id: 'i-0a1b2c3d4e5f60002', type: 'EC2', account: 'production', region: 'ap-southeast-1' },
  { name: 'prod-worker-01', id: 'i-0a1b2c3d4e5f60003', type: 'EC2', account: 'production', region: 'us-east-1', finding: 'imds' },
  { name: 'acme-prod-reports', id: 'acme-prod-reports', type: 'S3', account: 'production', region: 'ap-southeast-1', finding: 'publicBucket' },
  { name: 'acme-prod-audit', id: 'acme-prod-audit', type: 'S3', account: 'production', region: 'us-east-1' },
  { name: 'acme-prod-backups', id: 'acme-prod-backups', type: 'S3', account: 'production', region: 'us-east-1' },
  { name: 'stage-api-01', id: 'i-0b1c2d3e4f5a60001', type: 'EC2', account: 'staging', region: 'ap-southeast-1' },
  { name: 'stage-worker-01', id: 'i-0b1c2d3e4f5a60002', type: 'EC2', account: 'staging', region: 'eu-west-1', finding: 'unencryptedVolume' },
  { name: 'stage-runner-01', id: 'i-0b1c2d3e4f5a60003', type: 'EC2', account: 'staging', region: 'eu-west-1' },
  { name: 'acme-stage-assets', id: 'acme-stage-assets', type: 'S3', account: 'staging', region: 'ap-southeast-1', finding: 'logging' },
  { name: 'acme-stage-artifacts', id: 'acme-stage-artifacts', type: 'S3', account: 'staging', region: 'eu-west-1' },
  { name: 'acme-stage-backups', id: 'acme-stage-backups', type: 'S3', account: 'staging', region: 'eu-west-1', finding: 'versioning' },
  { name: 'dev-sandbox-01', id: 'i-0c1d2e3f4a5b60001', type: 'EC2', account: 'development', region: 'us-east-1', finding: 'openSSH' },
  { name: 'dev-runner-01', id: 'i-0c1d2e3f4a5b60002', type: 'EC2', account: 'development', region: 'us-east-1' },
  { name: 'dev-tools-01', id: 'i-0c1d2e3f4a5b60003', type: 'EC2', account: 'development', region: 'ap-southeast-1', finding: 'imds' },
  { name: 'acme-dev-assets', id: 'acme-dev-assets', type: 'S3', account: 'development', region: 'us-east-1' },
  { name: 'acme-dev-datasets', id: 'acme-dev-datasets', type: 'S3', account: 'development', region: 'us-east-1', finding: 'logging' },
  { name: 'acme-dev-artifacts', id: 'acme-dev-artifacts', type: 'S3', account: 'development', region: 'ap-southeast-1' }
];
const decisions = new Map();
const byId = id => document.getElementById(id);
const filterIds = ['account-filter', 'type-filter', 'status-filter'];
const dialog = byId('finding-dialog');
let selectedResource = null;
let lastReviewId = null;
let toastTimer;

function renderOverview() {
  const healthy = resources.filter(resource => !resource.finding).length;
  byId('account-count').textContent = Object.keys(accounts).length;
  byId('healthy-count').textContent = healthy;
  byId('finding-count').textContent = resources.length - healthy;
  byId('critical-count').textContent = resources.filter(resource => findings[resource.finding]?.severity === 'Critical').length;
  byId('posture-value').textContent = `${Math.round(healthy / resources.length * 100)}% compliant`;
  byId('meter-fill').style.width = `${healthy / resources.length * 100}%`;
  document.querySelector('[role="meter"]').setAttribute('aria-valuenow', healthy);
}

function renderResources() {
  const [account, type, status] = filterIds.map(id => byId(id).value);
  const visible = resources.filter(resource =>
    (account === 'all' || resource.account === account) &&
    (type === 'all' || resource.type === type) &&
    (status === 'all' || (status === 'noncompliant') === Boolean(resource.finding))
  );
  // All values below come from the fixed local fixtures and bounded decision labels.
  byId('resource-rows').innerHTML = visible.map(resource => {
    const finding = findings[resource.finding];
    const decision = decisions.get(resource.id) || 'Pending';
    return `<tr data-resource-id="${resource.id}">
      <td><div class="resource-cell"><span class="type-icon ${resource.type.toLowerCase()}">${resource.type}</span><div><span class="resource-name">${resource.name}</span><span class="subtext">${resource.id}</span></div></div></td>
      <td>${accounts[resource.account].name}<span class="subtext">${accounts[resource.account].id} · ${resource.region}</span></td>
      <td><span class="badge ${finding ? 'noncompliant' : 'compliant'}">${finding ? 'Non-compliant' : 'Compliant'}</span></td>
      <td class="finding-cell">${finding ? `<span class="badge ${finding.severity.toLowerCase()}">${finding.severity}</span><span>${finding.title}</span>` : '<span class="dash">No findings</span>'}</td>
      <td>${finding ? `<span class="badge ${decision === 'Approved once' ? 'approved' : decision.toLowerCase()} decision-status">${decision}</span>` : '<span class="dash">—</span>'}</td>
      <td>${finding ? `<button type="button" class="review-button" data-review="${resource.id}" aria-label="Review finding for ${resource.name}">${decisions.has(resource.id) ? 'View decision' : 'Review'} <span aria-hidden="true">↗</span></button>` : ''}</td>
    </tr>`;
  }).join('') || '<tr><td colspan="6" class="empty-state">No resources match these filters. Try another combination or reset filters.</td></tr>';
  byId('result-count').textContent = `Showing ${visible.length} of ${resources.length} resources`;
}

function renderDecision() {
  const decision = decisions.get(selectedResource.id);
  byId('dialog-decision').textContent = decision ? `Decision: ${decision}. Recorded for this demo session.` : 'Decision: Pending review';
  byId('approve-finding').disabled = Boolean(decision);
  byId('reject-finding').disabled = Boolean(decision);
}

function openFinding(id) {
  selectedResource = resources.find(resource => resource.id === id);
  if (!selectedResource?.finding) return;
  lastReviewId = id;
  const finding = findings[selectedResource.finding];
  byId('finding-title').textContent = finding.title;
  byId('finding-description').textContent = finding.description;
  byId('finding-remediation').textContent = finding.remediation;
  byId('finding-resource').textContent = `${selectedResource.name} (${selectedResource.id})`;
  byId('finding-account').textContent = `${accounts[selectedResource.account].name} · ${accounts[selectedResource.account].id} · ${selectedResource.region}`;
  byId('finding-severity').textContent = finding.severity;
  byId('finding-severity').className = `badge ${finding.severity.toLowerCase()}`;
  renderDecision();
  dialog.showModal();
  byId('close-dialog').focus();
}

function decide(decision) {
  if (!selectedResource || decisions.has(selectedResource.id)) return;
  decisions.set(selectedResource.id, decision);
  renderResources();
  renderDecision();
  // Keep focus on an enabled control after both decision buttons become disabled.
  byId('close-dialog').focus();
  byId('toast').textContent = `${selectedResource.name}: ${decision}. Demo only — no AWS changes.`;
  byId('toast').classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => byId('toast').classList.remove('visible'), 5000);
}

filterIds.forEach(id => byId(id).addEventListener('change', renderResources));
byId('reset-filters').addEventListener('click', () => {
  filterIds.forEach(id => { byId(id).value = 'all'; });
  renderResources();
});
byId('resource-rows').addEventListener('click', event => {
  const button = event.target.closest('[data-review]');
  if (button) openFinding(button.dataset.review);
});
byId('close-dialog').addEventListener('click', () => dialog.close());
dialog.addEventListener('close', () => {
  // Rendering replaced the invoking button; restore focus to its replacement.
  document.querySelector(`[data-review="${lastReviewId}"]`)?.focus();
  selectedResource = null;
});
byId('approve-finding').addEventListener('click', () => decide('Approved once'));
byId('reject-finding').addEventListener('click', () => decide('Rejected'));
function renderThemeButton() {
  const dark = document.documentElement.dataset.theme === 'dark';
  byId('theme-toggle').textContent = dark ? 'Light mode' : 'Dark mode';
  byId('theme-toggle').setAttribute('aria-pressed', dark);
  byId('theme-toggle').setAttribute('aria-label', `Dark mode ${dark ? 'on' : 'off'}; switch to ${dark ? 'light' : 'dark'} mode`);
}
byId('theme-toggle').addEventListener('click', () => {
  const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = theme;
  try { localStorage.setItem('cloudops-theme', theme); } catch { /* Theme still works without storage. */ }
  renderThemeButton();
});
renderOverview();
renderResources();
renderThemeButton();
