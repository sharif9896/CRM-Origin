type Props = {
  available: string[];
  value: string[];
  onChange: (value: string[]) => void;
};

const humanize = (value: string) => value
  .replace(/^menu:/, '')
  .replace(/:/g, ' / ')
  .replace(/([A-Z])/g, ' $1')
  .replace(/[-_]/g, ' ')
  .replace(/^./, character => character.toUpperCase());

export default function PermissionChecklist({ available, value, onChange }: Props) {
  const selected = new Set(value);
  const groups = [
    {
      title: 'Sidebar access',
      description: 'Choose each menu and submenu this role can see and open.',
      permissions: available.filter(permission => permission.startsWith('menu:')),
    },
    {
      title: 'Record actions',
      description: 'Choose what this role can read, create, edit, and delete.',
      permissions: available.filter(permission => !permission.startsWith('menu:')),
    },
  ];

  const toggleGroup = (permissions: string[], checked: boolean) => {
    const next = new Set(value);
    for (const permission of permissions) {
      if (checked) next.add(permission);
      else next.delete(permission);
    }
    onChange([...next]);
  };

  return <div className="permission-sections">
    {groups.map(group => {
      const checkedCount = group.permissions.filter(permission => selected.has(permission)).length;
      const allChecked = checkedCount === group.permissions.length;
      return <section className="permission-section" key={group.title}>
        <div className="permission-section-heading">
          <div><strong>{group.title}</strong><span>{group.description}</span></div>
          <label className="permission-select-all">
            <input
              type="checkbox"
              checked={allChecked}
              ref={element => { if (element) element.indeterminate = checkedCount > 0 && !allChecked; }}
              onChange={event => toggleGroup(group.permissions, event.target.checked)}
            />
            <span>{allChecked ? 'Clear all' : 'Select all'}</span>
          </label>
        </div>
        <div className="permission-grid">
          {group.permissions.map(permission => <label key={permission}>
            <input
              type="checkbox"
              aria-label={humanize(permission)}
              checked={selected.has(permission)}
              onChange={event => onChange(event.target.checked
                ? [...new Set([...value, permission])]
                : value.filter(item => item !== permission))}
            />
            <span>{humanize(permission)}</span>
          </label>)}
        </div>
      </section>;
    })}
  </div>;
}
