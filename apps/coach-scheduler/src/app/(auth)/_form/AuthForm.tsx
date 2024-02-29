import { OnFailField } from './OnFailField';
import { ConditionalMessage } from './ConditionalMessage';

export async function AuthForm() {

  return (
    <div>
      <ConditionalMessage />
      <fieldset>
        <input type="email" name="email" placeholder="you@example.com" required />
        <OnFailField />
      </fieldset>
    </div>
  );
}
