<?php

namespace App\Listeners;

use Statamic\Events\FormSubmitted;
use Illuminate\Support\Facades\Log;
use GuzzleHttp\Exception\ClientException;
use Illuminate\Validation\ValidationException;

class FormListener
{
    /**
     * Handle the event when a form is submitted.
     *
     * @param FormSubmitted $event The form submission event
     * @return void
     * @throws ValidationException If captcha fails or if there is an error with the Workbooks API
     */
    public function handle(FormSubmitted $event)
    {
        // This is where you load the secret key
        $secretKey = config('services.cloudflare.secret_key');
        // Throws error if secret is missing
        if (!$secretKey) {
            throw ValidationException::withMessages(['Secret key is missing.']);
        };
        
        // Get the token from the client side verification
        $token = $event->submission->get('cf_turnstile_response');
        //Log::debug(print_r($event, true));
        //Log::debug(print_r($event->submission, true));
        //Log::debug('Full form data: ' . print_r($event->submission->data()->all(), true));
        // Throws error if token missing
        if (!$token) {
            throw ValidationException::withMessages(['Captcha token is missing from the form submission.']);
        };

        // Gets the IP
        $ip = $_SERVER['REMOTE_ADDR'];
        // Throws error if ip missing
        if (!$ip) {
            throw ValidationException::withMessages(['IP is missing.']);
        };

        // Prepare the payload to send to the validation endpoint.
        $formParams = [
            'secret' => $secretKey,
            'response' => $token,
            'remoteip' => $ip,
        ];

        // Initialize Guzzle HTTP client to create a POST request.
        $client = new \GuzzleHttp\Client();

        // Try getting response
        try {
            // Send request
            $response = $client->post('https://challenges.cloudflare.com/turnstile/v0/siteverify', [
                'form_params' => $formParams,
            ]);

            // Decode Repsonse
            $statusCode = $response->getStatusCode();
            $body = $response->getBody()->getContents();
            $content = json_decode($body);

            // Check for JSON errors
            if ($content === null && json_last_error() !== JSON_ERROR_NONE) {
                throw new \Exception('Invalid JSON: ' . json_last_error_msg());
            }

            // Log the response and its respective parts (for debugging)
            //Log::debug('Captcha verification response: ' . print_r($response, true));
            //Log::debug('Captcha verification status code: ' . print_r($statusCode, true));
            //Log::debug('Captcha verification response: ' . print_r($body, true));
            //Log::debug('Captcha verification content: ' . print_r($content, true));

            // If content does not contain sucess
            if (!$content->success) {
                // Throw error
                throw ValidationException::withMessages(['Captcha failed']);
            }
        // Catch any Guzzle client exceptions
        } catch (ClientException $e) {
            $responseBodyAsString = $e->hasResponse() ? $e->getResponse()->getBody()->getContents() : '';
            //Log::debug(print_r($responseBodyAsString, true));
            throw $e;
        // Catch any other exceptions
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            //Log::error(print_r($e));
            throw $e;
        }

        // Return true to indicate successful handling of the form submission
        return true;
    }
}