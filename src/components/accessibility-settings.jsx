'use client';
import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
function Preference({ id, title, description, checked, onChange, disabled }) {
  return (
    <div className="preference">
      <div>
        <Label htmlFor={id}>{title}</Label>
        <p id={id + '-help'}>{description}</p>
      </div>
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={onChange}
        disabled={disabled}
        aria-describedby={id + '-help'}
      />
    </div>
  );
}
export function AccessibilitySettings({
  open,
  onClose,
  highContrast,
  setHighContrast,
  largeText,
  setLargeText,
  paused,
  setPause,
  reducedMotion,
  focusMode,
  setFocusMode,
  simpleFont,
  setSimpleFont,
  readingSpace,
  setReadingSpace,
  fieldHelp,
  setFieldHelp,
}) {
  const dialog = useRef(null);
  const [group, setGroup] = useState('vision');
  useEffect(() => {
    const element = dialog.current;
    if (open && !element.open) element.showModal();
    else if (!open && element.open) element.close();
  }, [open]);
  return (
    <dialog
      ref={dialog}
      id="accessibility-panel"
      className="access-dialog"
      aria-labelledby="access-title"
      aria-describedby="access-description"
      onCancel={onClose}
      onClose={onClose}
    >
      <div className="access-dialog-header">
        <div>
          <h2 id="access-title">Do seu jeito.</h2>
          <p id="access-description">Escolha os ajustes que deixam o cadastro confortável.</p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Fechar acessibilidade"
          onClick={onClose}
        >
          <X size={20} aria-hidden="true" />
        </Button>
      </div>
      <div className="preference-groups" role="group" aria-label="Categorias de acessibilidade">
        <Button
          variant="ghost"
          aria-pressed={group === 'vision'}
          onClick={() => setGroup('vision')}
        >
          Visão
        </Button>
        <Button
          variant="ghost"
          aria-pressed={group === 'comfort'}
          onClick={() => setGroup('comfort')}
        >
          Conforto
        </Button>
      </div>
      <section
        className="preference-list"
        aria-label={group === 'vision' ? 'Ajustes de visão' : 'Ajustes de conforto'}
      >
        {group === 'vision' ? (
          <>
            <Preference
              id="contrast"
              title="Alto contraste"
              description="Cores e contornos mais definidos."
              checked={highContrast}
              onChange={setHighContrast}
            />
            <Preference
              id="text-size"
              title="Texto ampliado"
              description="Letras maiores sem cortar os campos."
              checked={largeText}
              onChange={setLargeText}
            />
            <Preference
              id="simple-font"
              title="Fonte simples"
              description="Usa Arial em títulos e textos para facilitar a leitura."
              checked={simpleFont}
              onChange={setSimpleFont}
            />
            <Preference
              id="reading-space"
              title="Mais espaçamento"
              description="Mais espaço entre letras, palavras e linhas."
              checked={readingSpace}
              onChange={setReadingSpace}
            />
          </>
        ) : (
          <>
            <Preference
              id="focus-mode"
              title="Modo foco"
              description="Oculta a apresentação decorativa para destacar o formulário."
              checked={focusMode}
              onChange={setFocusMode}
            />
            <Preference
              id="field-help"
              title="Dicas de preenchimento"
              description="Exibe instruções e exemplos ao lado de cada campo."
              checked={fieldHelp}
              onChange={setFieldHelp}
            />
          </>
        )}
      </section>
      <div className="motion-preference">
        <Preference
          id="pause-motion"
          title="Pausar animações"
          description={
            reducedMotion
              ? 'Movimento reduzido já está ativo no seu sistema.'
              : 'Mantém o mascote e as transições em poses estáticas.'
          }
          checked={paused}
          onChange={setPause}
          disabled={reducedMotion}
        />
      </div>
    </dialog>
  );
}
