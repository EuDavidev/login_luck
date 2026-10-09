'use client';

import { Command as CommandPrimitive } from 'cmdk';
import { Search } from 'lucide-react';
export function Command(props) {
  return <CommandPrimitive className="ui-command" {...props} />;
}
export function CommandInput(props) {
  return (
    <div className="command-search">
      <Search size={18} aria-hidden="true" />
      <CommandPrimitive.Input className="command-input" {...props} />
    </div>
  );
}
export function CommandList(props) {
  return <CommandPrimitive.List className="command-list" {...props} />;
}
export function CommandEmpty(props) {
  return <CommandPrimitive.Empty className="command-empty" {...props} />;
}
export function CommandItem(props) {
  return <CommandPrimitive.Item className="command-item" {...props} />;
}
