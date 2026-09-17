import RecordWorkspace from '../../components/workspace/recordWorkspace';
export default function Roles() { return <><div className="ws-notice"><span>Administrators always have full access. Manager, Senior Agent, Agent, Viewer, Customer, and Staff are ready to configure. Read, create, and update permissions control matching sidebar links; delete permissions control record actions. Assign roles under Staff → User Accounts.</span></div><RecordWorkspace resource="roles" title="Roles & permissions" /></>; }

