<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { commentFormSchema, type CommentFormSchema } from './comment-schema';
	import { Textarea } from '$lib/components/ui/textarea';

	export let data: SuperValidated<Infer<CommentFormSchema>>;

	const form = superForm(data, {
		validators: zodClient(commentFormSchema)
	});

	const { form: formData } = form;
</script>

<form method="POST" action="?/comment">
	<Form.Field {form} name="comment">
		<Form.Control let:attrs>
			<Form.Label>Comment</Form.Label>
			<Textarea {...attrs} bind:value={$formData.comment} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Button class="ms-auto block w-3/12">Post</Form.Button>
</form>
