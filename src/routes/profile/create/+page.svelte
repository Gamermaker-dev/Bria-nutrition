<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import PostForm from '$lib/components/PostForm.svelte';
	import { isLoading } from '$lib/stores.js';
	import {
		mdiAccountPlus,
		mdiBabyBottle,
		mdiFaceManProfile,
		mdiHumanFemale,
		mdiHumanMale,
		mdiHumanPregnant,
		mdiRun,
		mdiRunFast,
		mdiSeat,
		mdiWalk,
		mdiWeightLifter
	} from '@mdi/js';
	import clsx from 'clsx';
	import { Button, DateField, Icon, Steps, TextField } from 'svelte-ux';

	let { data, form } = $props();

	const steps: { label: string; icon: string; completed: boolean }[] = [
		{ label: 'Register', icon: mdiAccountPlus, completed: true },
		{ label: 'Profile', icon: mdiFaceManProfile, completed: false }
	];

	let input: {
		birthDate?: Date;
		physicalTypeId?: number;
		heightFeet?: number;
		heightInch?: number;
		weight?: number;
		activityLevelId?: number;
	} = $state({});
	let activityLevels = $derived(data.activityLevels ? data.activityLevels : []);
	let physicalTypes = $derived(data.physicalTypes ? data.physicalTypes : []);

	$effect(() => {
		if (form?.status === 200) goto(resolve('/'));
	});
</script>

<div class="flex flex-col gap-4 mx-auto">
	<Steps data={steps} />

	<PostForm {form} />

	<DateField name="birthDate" label="Birth Date" bind:value={input.birthDate} picker />
	<!-- svelte-ignore a11y_label_has_associated_control -->
	<label class="label">Physical Factor</label>
	<div class="flex flex-row gap-4">
		{#each physicalTypes as phys (phys.value)}
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div
				class={clsx(
					'flex-1 border border-black elevation-2 shadow-sm py-4 hover:cursor-pointer hover:bg-blue-200 hover:text-white',
					input.physicalTypeId === phys.value && 'bg-blue-500 text-white'
				)}
				onclick={() => {
					input.physicalTypeId = phys.value;
					input = input;
				}}
			>
				<Icon
					path={phys.label === 'Male'
						? mdiHumanMale
						: phys.label === 'Female'
							? mdiHumanFemale
							: phys.label === 'Pregnant'
								? mdiHumanPregnant
								: mdiBabyBottle}
				/>
				{phys.label}
			</div>
		{/each}
	</div>
	<div class="flex flex-row gap-2">
		<TextField
			name="heightFeet"
			label="Height (feet)"
			type="integer"
			classes={{ root: 'flex-1' }}
			bind:value={input.heightFeet}
		/>
		<TextField
			name="heightInch"
			label="Height (inches)"
			type="integer"
			classes={{ root: 'flex-1' }}
			bind:value={input.heightInch}
		/>
	</div>
	<TextField name="weight" label="Weight (lbs)" bind:value={input.weight} />
	<div class="flex flex-row gap-2">
		{#each activityLevels as level (level.id)}
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div
				class={clsx(
					'flex-1 border border-black elevation-2 shadow-sm py-4 hover:cursor-pointer hover:bg-primary-200 hover:text-white',
					input.activityLevelId === level.id && 'bg-primary-500 text-white'
				)}
				onclick={() => {
					input.activityLevelId = level.id;
				}}
			>
				<div class="grid grid-cols-[auto,1fr]">
					<Icon
						path={level.multiplier == 1.2
							? mdiSeat
							: level.multiplier == 1.375
								? mdiWalk
								: level.multiplier == 1.55
									? mdiRun
									: level.multiplier == 1.725
										? mdiRunFast
										: mdiWeightLifter}
					/>
					<span>{level.name}</span>
					<span class="col-span-2 text-xs">{level.description}</span>
				</div>
			</div>
		{/each}
	</div>

	<form
		method="post"
		id="createProfileForm"
		action={resolve('/profile/create')}
		use:enhance={() => {
			const timer = setTimeout(() => ($isLoading = true), 100);
			return async ({ update }) => {
				await update();
				clearTimeout(timer);
				$isLoading = false;
			};
		}}
	>
		<input type="hidden" name="birthDate" value={input.birthDate} />
		<input type="hidden" name="physicalType" value={input.physicalTypeId} />
		<input type="hidden" name="heightInch" value={input.heightInch} />
		<input type="hidden" name="heightFeet" value={input.heightFeet} />
		<input type="hidden" name="weight" value={input.weight} />
		<input type="hidden" name="activityLevel" value={input.activityLevelId} />
		<Button class="bg-primary w-fit text-white" type="submit">Submit</Button>
	</form>
</div>
