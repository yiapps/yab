# frozen_string_literal: true

class EmailPermutationValidator < ActiveModel::Validator
  def validate(user)
    return if user.email.blank?

    @email = user.email
    @blocked_emails = ENV['BLOCKED_EMAILS'].split(',')
    user.errors.add(:email, I18n.t('users.invalid_email')) if blocked_email?
  end

  private

  def blocked_email?
    @blocked_emails.include? stripped_dots_email
  end

  def stripped_dots_email
    username, domain = @email.split('@')
    "#{username.gsub('.', '')}@#{domain}"
  end
end
