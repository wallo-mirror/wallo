<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { inviteFormSchema, type InviteFormSchema } from './invite-moderator';
	import { X } from 'lucide-svelte';

	export let data: SuperValidated<Infer<InviteFormSchema>>;

	export let email: string;

	const form = superForm(data, {
		validators: zodClient(inviteFormSchema)
	});
</script>

<div>
	<form class="flex gap-2" method="POST">
		<Form.Field {form} name="email" class="hidden">
			<Form.Control let:attrs>
				<Input {...attrs} bind:value={email} />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
		<div>
			<Form.Button size="icon" variant="ghost" formaction="?/deleteInvite">
				<X />
			</Form.Button>
		</div>
	</form>
</div>
