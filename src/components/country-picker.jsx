'use client';

import { useState } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandItem,
} from '@/components/ui/command';
import { countryOptions } from '@/lib/countries';
export function CountryPicker({
  value,
  onChange,
  onBlur,
  inputRef,
  invalid,
  describedBy,
  highContrast,
  largeText,
  simpleFont,
  readingSpace,
}) {
  const [open, setOpen] = useState(false);
  const name = countryOptions.find((country) => country.code === value)?.name;
  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) onBlur();
      }}
    >
      <PopoverTrigger asChild>
        <button
          ref={inputRef}
          id="country"
          type="button"
          role="combobox"
          aria-label="País"
          aria-expanded={open}
          aria-controls={open ? 'country-popover' : undefined}
          aria-required="true"
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
          className={'ui-input country-trigger' + (!name ? ' placeholder' : '')}
        >
          <span>{name || 'Selecione seu país'}</span>
          <ChevronsUpDown size={18} aria-hidden="true" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        id="country-popover"
        aria-label="Selecionar país"
        className={
          (highContrast ? 'high-contrast ' : '') +
          (largeText ? 'large-text ' : '') +
          (simpleFont ? 'simple-font ' : '') +
          (readingSpace ? 'reading-space' : '')
        }
      >
        <Command label="Selecionar país">
          <CommandInput aria-label="Buscar país" placeholder="Buscar país..." />
          <CommandList aria-label="Países">
            <CommandEmpty>Nenhum país encontrado.</CommandEmpty>
            {countryOptions.map((country) => (
              <CommandItem
                key={country.code}
                value={country.name}
                onSelect={() => {
                  onChange(country.code);
                  setOpen(false);
                  onBlur();
                }}
              >
                <span>{country.name}</span>
                {country.code === value && <Check size={16} aria-hidden="true" />}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
