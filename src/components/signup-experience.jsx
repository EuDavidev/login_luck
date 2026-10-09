'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import Link from 'next/link';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import {
  Accessibility,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCheck,
  ChevronDown,
  Compass,
  Eye,
  EyeOff,
  Flag,
  Heart,
  LoaderCircle,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
  UserRound,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AccessibilitySettings } from '@/components/accessibility-settings';
import { CountryPicker } from '@/components/country-picker';
import { Mascot } from '@/components/mascot';
import { calculateAge, validateBirthDate } from '@/lib/profile';
gsap.registerPlugin(useGSAP);
const motionQuery = '(prefers-reduced-motion: reduce)';
function subscribeMotion(callback) {
  const query = window.matchMedia(motionQuery);
  query.addEventListener('change', callback);
  return () => query.removeEventListener('change', callback);
}
function getMotion() {
  return window.matchMedia(motionQuery).matches;
}
const fieldNames = {
  name: 'Nome',
  email: 'E-mail',
  password: 'Senha',
  birthDate: 'Data de nascimento',
  country: 'País',
  city: 'Cidade',
};
const emptyValues = {
  name: '',
  email: '',
  password: '',
  birthDate: '',
  country: '',
  region: '',
  city: '',
};
function JourneyMap() {
  return (
    <svg className="journey-map" viewBox="0 0 620 760" fill="none" aria-hidden="true">
      <path
        d="M-90 125C70-22 277 10 346 175S504 406 699 325M-92 150C58 11 257 32 319 189S481 435 681 357M-95 178C42 45 232 55 290 208S452 465 664 389M-96 206C25 79 207 79 261 227S425 495 647 421M-94 235C10 111 181 104 232 246S398 523 630 453"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path
        d="M-120 690C65 530 163 702 287 615S356 463 516 503S703 660 740 571M-120 717C65 557 163 729 287 642S356 490 516 530S703 687 740 598M-120 744C65 584 163 756 287 669S356 517 516 557S703 714 740 625"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path
        d="M75 415Q118 358 184 400T291 368"
        stroke="#6790C7"
        strokeWidth="2"
        strokeDasharray="5 8"
      />
      <circle cx="76" cy="415" r="5" fill="#6790C7" />
      <circle cx="291" cy="368" r="5" fill="#6790C7" />
    </svg>
  );
}
export default function SignupExperience() {
  const [step, setStep] = useState(1),
    [success, setSuccess] = useState(false),
    [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false),
    [showErrors, setShowErrors] = useState(false),
    [mood, setMood] = useState('welcome');
  const [accessOpen, setAccessOpen] = useState(false),
    [highContrast, setHighContrast] = useState(false),
    [largeText, setLargeText] = useState(false),
    [pause, setPause] = useState(false),
    [focusMode, setFocusMode] = useState(false),
    [simpleFont, setSimpleFont] = useState(false),
    [readingSpace, setReadingSpace] = useState(false),
    [fieldHelp, setFieldHelp] = useState(false);
  const reducedMotion = useSyncExternalStore(subscribeMotion, getMotion, () => false),
    paused = pause || reducedMotion;
  const container = useRef(null),
    heading = useRef(null),
    timer = useRef(null),
    pendingHeadingFocus = useRef(false);
  const {
    register,
    control,
    trigger,
    getFieldState,
    setFocus,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: emptyValues,
    mode: 'onTouched',
    shouldUnregister: false,
  });
  const [birthDate, password, name] = useWatch({
    control,
    name: ['birthDate', 'password', 'name'],
  });
  const age = calculateAge(birthDate),
    hasLongPassword = password.length >= 8;
  const visibleErrors = Object.keys(fieldNames).filter((key) => errors[key]);
  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => {
    if (!pendingHeadingFocus.current) return;
    pendingHeadingFocus.current = false;
    heading.current?.focus();
  }, [step, success]);
  useGSAP(
    () => {
      if (paused) return;
      gsap.fromTo(
        '.form-stage',
        {
          opacity: 0,
          y: 8,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.28,
          ease: 'power2.out',
        },
      );
    },
    {
      scope: container,
      dependencies: [step, success, paused],
      revertOnUpdate: true,
    },
  );
  async function next(event) {
    event.preventDefault();
    const valid = await trigger(['name', 'email', 'password']);
    setShowErrors(!valid);
    if (!valid) {
      setMood('error');
      setFocus(['name', 'email', 'password'].find((key) => getFieldState(key).invalid) || 'name');
      return;
    }
    pendingHeadingFocus.current = true;
    setStep(2);
    setMood('next');
  }
  function finish(event) {
    return handleSubmit(
      () => {
        setShowErrors(false);
        setLoading(true);
        setMood('processing');
        timer.current = setTimeout(() => {
          setValue('password', '');
          setLoading(false);
          pendingHeadingFocus.current = true;
          setSuccess(true);
          setMood('success');
        }, 900);
      },
      (invalid) => {
        setShowErrors(true);
        setMood('error');
        setFocus(Object.keys(fieldNames).find((key) => invalid[key]));
      },
    )(event);
  }
  function restart() {
    reset(emptyValues);
    pendingHeadingFocus.current = true;
    setSuccess(false);
    setStep(1);
    setShowErrors(false);
    setShowPassword(false);
    setMood('welcome');
  }
  const messages = success
    ? 'Conseguimos! A próxima aventura é sua.'
    : loading
      ? 'Só um instante. Preparando sua aventura...'
      : showErrors
        ? 'Tudo bem! Vamos revisar juntos.'
        : step === 2
          ? 'Quase lá! Vamos conhecer seu mundo.'
          : 'Oi! Eu sou o Luck. Vamos nessa?';
  const instructions = {
    name: 'Digite o nome pelo qual prefere ser chamado.',
    email: 'Exemplo: voce@exemplo.com. Use um endereço com @ e domínio.',
    password: 'Você pode usar uma frase longa e fácil de lembrar.',
    birthDate: 'Informe dia, mês e ano do seu nascimento.',
    country: 'Abra a lista e digite o nome do país para buscar.',
    region: 'Pode deixar vazio se não houver estado ou região no seu país.',
    city: 'Digite o nome da cidade onde você mora.',
  };
  function helperFor(key) {
    return fieldHelp ? (
      <p id={key + '-instruction'} className="field-hint extra-help">
        {instructions[key]}
      </p>
    ) : null;
  }
  function describedBy(key, base) {
    return (
      [base, fieldHelp ? key + '-instruction' : null, errors[key] ? key + '-error' : null]
        .filter(Boolean)
        .join(' ') || undefined
    );
  }
  function errorFor(key) {
    return errors[key] ? (
      <p id={key + '-error'} className="field-error">
        {errors[key].message}
      </p>
    ) : null;
  }
  const focusField = () => {
    if (!loading && !success) setMood(showErrors ? 'error' : 'focus');
  };
  return (
    <main
      ref={container}
      className={
        'signup-app' +
        (highContrast ? ' high-contrast' : '') +
        (largeText ? ' large-text' : '') +
        (paused ? ' motion-paused' : '') +
        (focusMode ? ' focus-mode' : '') +
        (simpleFont ? ' simple-font' : '') +
        (readingSpace ? ' reading-space' : '') +
        (showErrors ? ' with-errors' : '')
      }
    >
      <a className="skip-link" href="#signup-form">
        Ir para o cadastro
      </a>
      <header className="site-header">
        <Link href="/" className="brand" aria-label="Luck, início">
          <span className="brand-icon">
            <Compass size={25} strokeWidth={2.3} aria-hidden="true" />
          </span>
          <span>
            luck<span className="brand-dot">.</span>
          </span>
        </Link>
        <div className="header-right">
          <span className="header-note">Toda jornada começa com você.</span>
          <Button
            variant="outline"
            className="access-toggle"
            aria-expanded={accessOpen}
            aria-controls="accessibility-panel"
            onClick={() => setAccessOpen(!accessOpen)}
          >
            <Accessibility size={18} aria-hidden="true" />
            <span>Acessibilidade</span>
            <ChevronDown className={accessOpen ? 'rotate' : ''} size={15} aria-hidden="true" />
          </Button>
        </div>
      </header>
      <AccessibilitySettings
        open={accessOpen}
        onClose={() => setAccessOpen(false)}
        highContrast={highContrast}
        setHighContrast={setHighContrast}
        largeText={largeText}
        setLargeText={setLargeText}
        paused={paused}
        setPause={setPause}
        reducedMotion={reducedMotion}
        focusMode={focusMode}
        setFocusMode={setFocusMode}
        simpleFont={simpleFont}
        setSimpleFont={setSimpleFont}
        readingSpace={readingSpace}
        setReadingSpace={setReadingSpace}
        fieldHelp={fieldHelp}
        setFieldHelp={setFieldHelp}
      />
      <div className="experience-grid">
        <section className="adventure-panel" aria-labelledby="adventure-title">
          <JourneyMap />
          <div className="hero-copy">
            <div className="eyebrow">
              <span className="eyebrow-dot" />
              UM NOVO COMEÇO
            </div>
            <h1 id="adventure-title">
              Sua próxima
              <br /> aventura
              <br /> começa{' '}
              <span className="here-word">
                aqui.
                <svg viewBox="0 0 175 18" aria-hidden="true">
                  <path
                    d="M3 11Q80-4 171 9M15 16Q93 4 163 15"
                    stroke="currentColor"
                    strokeWidth="5"
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
              </span>
            </h1>
            <p>
              Um pequeno passo para criar sua conta.
              <br className="desktop-break" /> Um mundo de possibilidades pela frente.
            </p>
          </div>
          <div className="mascot-scene">
            <div className="speech-bubble" aria-hidden="true">
              {messages}
              <span className="speech-star">
                <Sparkles size={17} />
              </span>
            </div>
            <div className="mascot-stage">
              <span className="scene-orbit orbit-one" />
              <span className="scene-orbit orbit-two" />
              <span className="scene-spark spark-one">
                <Sparkles size={23} />
              </span>
              <span className="scene-spark spark-two">
                <Sparkles size={14} />
              </span>
              <Mascot mood={mood} paused={paused} />
              <span className="mascot-shadow" />
              <div className="companion-label">
                <span className="companion-dot" />
                Monkey D. Luck<span className="companion-subtitle">SEU COMPANHEIRO DE JORNADA</span>
              </div>
            </div>
          </div>
          <div className="hero-footnote">
            <Heart size={16} aria-hidden="true" />
            <span>Cada pessoa tem seu ritmo. Aqui, você segue o seu.</span>
          </div>
        </section>
        <section
          id="signup-form"
          className={'form-panel' + (showErrors ? ' has-errors' : '')}
          aria-label="Cadastro"
          tabIndex={-1}
        >
          <div className="form-topline">
            <span>
              <span className="small-spark">
                <Sparkles size={15} aria-hidden="true" />
              </span>{' '}
              SEU PRIMEIRO PASSO
            </span>
            <span className="demo-tag">DEMONSTRAÇÃO</span>
          </div>
          {!success && (
            <ol className="stepper" aria-label="Progresso do cadastro">
              <li
                aria-current={step === 1 ? 'step' : undefined}
                className={step === 1 ? 'active' : 'complete'}
              >
                <span className="step-circle">
                  {step === 2 ? <Check size={14} aria-hidden="true" /> : '01'}
                </span>
                <span>Sua conta</span>
              </li>
              <li className="step-connector" aria-hidden="true" />
              <li
                aria-current={step === 2 ? 'step' : undefined}
                className={step === 2 ? 'active' : ''}
              >
                <span className="step-circle">02</span>
                <span>Seu perfil</span>
              </li>
            </ol>
          )}
          <div className="form-stage">
            {success ? (
              <div className="success-state">
                <span className="success-icon">
                  <CheckCheck size={32} aria-hidden="true" />
                </span>
                <p className="success-eyebrow">JORNADA CONCLUÍDA</p>
                <h2 ref={heading} tabIndex={-1}>
                  Sua aventura está pronta!
                </h2>
                <p>
                  {name.split(' ')[0] || 'Olá'}, você chegou ao final. Obrigado por explorar essa
                  experiência com o Luck.
                </p>
                <div className="demo-success">
                  <ShieldCheck size={20} aria-hidden="true" />
                  <p>Demonstração concluída — nenhuma conta foi criada.</p>
                </div>
                <Button className="submit-button" onClick={restart}>
                  Recomeçar
                  <ArrowRight size={18} aria-hidden="true" />
                </Button>
              </div>
            ) : (
              <>
                <div className="form-heading">
                  <p className="step-caption">Etapa {step} de 2</p>
                  <h2 ref={heading} tabIndex={-1}>
                    {step === 1 ? 'Vamos começar?' : 'Um pouco sobre você.'}
                  </h2>
                  <p>
                    {step === 1
                      ? 'Crie seu acesso e deixe o resto com a gente.'
                      : 'Cada aventura tem uma origem. Conte a sua.'}
                  </p>
                </div>
                <form
                  noValidate
                  onSubmit={step === 1 ? next : finish}
                  aria-busy={loading}
                  onFocusCapture={focusField}
                >
                  {showErrors && visibleErrors.length > 0 && (
                    <div className="error-summary" role="alert">
                      <div>
                        <strong>
                          Revise{' '}
                          {visibleErrors.length === 1
                            ? '1 campo'
                            : visibleErrors.length + ' campos'}{' '}
                          para continuar.
                        </strong>
                        <p className="sr-only">
                          {visibleErrors.map((key) => errors[key].message).join(' ')}
                        </p>
                      </div>
                      <button type="button" onClick={() => setFocus(visibleErrors[0])}>
                        Ir ao primeiro erro
                      </button>
                    </div>
                  )}
                  <fieldset className="fields" disabled={loading}>
                    <legend className="sr-only">
                      {step === 1 ? 'Informações de acesso' : 'Informações de perfil'}
                    </legend>
                    {step === 1 ? (
                      <>
                        <div className="field">
                          <Label htmlFor="name">
                            Seu nome <span aria-hidden="true">*</span>
                          </Label>
                          <div className="input-wrap">
                            <UserRound size={18} aria-hidden="true" />
                            <Input
                              id="name"
                              autoComplete="name"
                              placeholder="Como podemos chamar você?"
                              aria-required="true"
                              aria-invalid={!!errors.name}
                              aria-describedby={describedBy('name')}
                              {...register('name', {
                                validate: (value) => value.trim().length > 0 || 'Informe seu nome.',
                              })}
                            />
                          </div>
                          {helperFor('name')}
                          {errorFor('name')}
                        </div>
                        <div className="field">
                          <Label htmlFor="email">
                            E-mail <span aria-hidden="true">*</span>
                          </Label>
                          <div className="input-wrap">
                            <Mail size={18} aria-hidden="true" />
                            <Input
                              id="email"
                              type="email"
                              autoComplete="email"
                              inputMode="email"
                              placeholder="voce@exemplo.com"
                              aria-required="true"
                              aria-invalid={!!errors.email}
                              aria-describedby={describedBy('email')}
                              {...register('email', {
                                required: 'Informe seu e-mail.',
                                pattern: {
                                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                  message: 'Informe um e-mail válido.',
                                },
                              })}
                            />
                          </div>
                          {helperFor('email')}
                          {errorFor('email')}
                        </div>
                        <div className="field">
                          <Label htmlFor="password">
                            Senha <span aria-hidden="true">*</span>
                          </Label>
                          <div className="input-wrap password-wrap">
                            <LockKeyhole size={18} aria-hidden="true" />
                            <Input
                              id="password"
                              type={showPassword ? 'text' : 'password'}
                              autoComplete="new-password"
                              placeholder="Crie uma senha"
                              aria-required="true"
                              aria-invalid={!!errors.password}
                              aria-describedby={describedBy('password', 'password-help')}
                              {...register('password', {
                                required: 'Crie uma senha.',
                                minLength: {
                                  value: 8,
                                  message: 'Use pelo menos 8 caracteres na senha.',
                                },
                              })}
                            />
                            <button
                              className="password-toggle"
                              type="button"
                              aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                              aria-pressed={showPassword}
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff size={18} aria-hidden="true" />
                              ) : (
                                <Eye size={18} aria-hidden="true" />
                              )}
                            </button>
                          </div>
                          <p
                            className={
                              'field-hint password-hint' + (hasLongPassword ? ' satisfied' : '')
                            }
                            id="password-help"
                          >
                            <span className="hint-check">
                              {hasLongPassword ? <Check size={12} aria-hidden="true" /> : <span />}
                            </span>
                            Pelo menos 8 caracteres. Você pode colar sua senha.
                          </p>
                          {helperFor('password')}
                          {errorFor('password')}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="field">
                          <Label htmlFor="birthDate">
                            Data de nascimento <span aria-hidden="true">*</span>
                          </Label>
                          <Input
                            id="birthDate"
                            type="date"
                            autoComplete="bday"
                            aria-required="true"
                            aria-invalid={!!errors.birthDate}
                            aria-describedby={describedBy('birthDate', 'birthDate-help')}
                            {...register('birthDate', {
                              validate: (value) => validateBirthDate(value),
                            })}
                          />
                          <p className="field-hint" id="birthDate-help">
                            {age === null
                              ? 'Sua idade será calculada automaticamente.'
                              : 'Sua idade: ' + age + (age === 1 ? ' ano.' : ' anos.')}
                          </p>
                          {helperFor('birthDate')}
                          {errorFor('birthDate')}
                        </div>
                        <div className="field">
                          <Label htmlFor="country">
                            País <span aria-hidden="true">*</span>
                          </Label>
                          <Controller
                            name="country"
                            control={control}
                            rules={{
                              required: 'Selecione seu país.',
                            }}
                            render={({ field }) => (
                              <CountryPicker
                                value={field.value}
                                onChange={field.onChange}
                                onBlur={field.onBlur}
                                inputRef={field.ref}
                                invalid={!!errors.country}
                                describedBy={describedBy('country')}
                                highContrast={highContrast}
                                largeText={largeText}
                                simpleFont={simpleFont}
                                readingSpace={readingSpace}
                              />
                            )}
                          />
                          {helperFor('country')}
                          {errorFor('country')}
                        </div>
                        <div className="location-fields">
                          <div className="field">
                            <Label htmlFor="region">
                              Estado/região <span className="optional">opcional</span>
                            </Label>
                            <Input
                              id="region"
                              placeholder="Seu estado ou região"
                              aria-describedby={describedBy('region')}
                              autoComplete="address-level1"
                              {...register('region')}
                            />
                            {helperFor('region')}
                          </div>
                          <div className="field">
                            <Label htmlFor="city">
                              Cidade <span aria-hidden="true">*</span>
                            </Label>
                            <Input
                              id="city"
                              placeholder="Sua cidade"
                              autoComplete="address-level2"
                              aria-required="true"
                              aria-invalid={!!errors.city}
                              aria-describedby={describedBy('city')}
                              {...register('city', {
                                validate: (value) =>
                                  value.trim().length > 0 || 'Informe sua cidade.',
                              })}
                            />
                            {helperFor('city')}
                            {errorFor('city')}
                          </div>
                        </div>
                      </>
                    )}
                  </fieldset>
                  <p className="required-note">Os campos com * são obrigatórios.</p>
                  <div className="form-actions">
                    {step === 2 && (
                      <Button
                        type="button"
                        variant="outline"
                        disabled={loading}
                        onClick={() => {
                          setStep(1);
                          setShowErrors(false);
                          setMood('idle');
                        }}
                      >
                        <ArrowLeft size={17} aria-hidden="true" />
                        Voltar
                      </Button>
                    )}
                    <Button type="submit" className="submit-button" disabled={loading}>
                      {loading ? (
                        <>
                          <LoaderCircle className="spinner" size={18} aria-hidden="true" />
                          Preparando...
                        </>
                      ) : (
                        <>
                          {step === 1 ? 'Continuar' : 'Concluir cadastro'}
                          <ArrowRight size={18} aria-hidden="true" />
                        </>
                      )}
                    </Button>
                  </div>
                  <div className="form-reassurance">
                    <ShieldCheck size={15} aria-hidden="true" />
                    <span>Sem pressa. Seus dados ficam só nesta página.</span>
                  </div>
                </form>
              </>
            )}
          </div>
          <div className="form-bottom">
            <div className="bottom-compass">
              <Flag size={16} aria-hidden="true" />
            </div>
            <p>
              Uma experiência feita para todos.
              <br />
              <span>Acessível, acolhedora e no seu ritmo.</span>
            </p>
          </div>
        </section>
      </div>
      <footer className="site-footer">
        <span>© {new Date().getFullYear()} Luck. Feito para novos começos.</span>
        <span className="footer-demo">
          <span />
          Protótipo interativo · Nenhuma conta real é criada.
        </span>
      </footer>
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {loading
          ? 'Preparando a conclusão da demonstração.'
          : success
            ? 'Demonstração concluída. Nenhuma conta foi criada.'
            : ''}
      </div>
    </main>
  );
}
