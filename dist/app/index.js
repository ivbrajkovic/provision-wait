import { h } from 'preact';
import { useState } from 'preact/hooks';

import Input from '../components/input';

const checkInput = value => {
  const reg = /^\d+$/;
  return (
    (value && value.length > 5 && value.length < 10 && reg.test(value)) || false
  );
};

const onClick = (asset, telefon, setError) => {
  const isAsset = checkInput(asset);
  const isTelefon = checkInput(telefon);

  if ((asset && !isAsset) || (!asset && !telefon))
    setError({ control: 'asset', error: 'Neispravan asset' });
  else if (!asset && telefon && !isTelefon)
    setError({ control: 'telefon', error: 'Neispravan telefonski broj' });
  // else if (isAsset || isTelefon)
  else
    chrome.runtime.sendMessage({
      asset,
      telefon
    });
};

const App = () => {
  const [asset, setAsset] = useState();
  const [telefon, setTelefon] = useState();
  const [error, setError] = useState();

  const onInput = (value, setState) => {
    setError('');
    setState(value);
  };

  return (
    <div class="container">
      <Input
        id="asset"
        value={asset}
        onInput={e => onInput(e.target.value, setAsset)}
        error={error}
      />

      <Input
        id="telefon"
        value={telefon}
        onInput={e => onInput(e.target.value, setTelefon)}
        error={error}
      />

      <button
        id="btnAsset"
        class="button"
        title="Pretrazuje potrebne informacije."
        onClick={() => onClick(asset, telefon, setError)}
      >
        Traži
      </button>
    </div>
  );
};

export default App;
